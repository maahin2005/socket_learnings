import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { logger } from "../middleware/logger.middleware";
import { envConfig } from "./env";
import { ChatModel } from "../models/chat.model";

interface ISocketConfigOptions {
  httpServer: HttpServer;
  sessionConfig: any;
}

const EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  PRIVATE_MESSAGE: "private_message",
};

export const socketConfig = ({
  httpServer,
  sessionConfig,
}: ISocketConfigOptions) => {
  const allowedOrigins = envConfig.clientOrigins;

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  logger.info("✅ Socket.IO server initialized");

  io.use((socket, next) => {
    try {
      // @ts-ignore
      sessionConfig(socket.request, {} as any, next);
    } catch (err: any) {
      logger.error("❌ Session middleware failed", err);
      next(err);
    }
  });

  io.use((socket, next) => {
    const req = socket.request as any;
    if (req.session && req.session.userId) {
      logger.info(`🔐 Socket connected for user ${req.session.userId}`);
      return next();
    }
    logger.warn("🚫 Unauthorized socket attempt");
    return next(new Error("Unauthorized"));
  });

  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    logger.info(`🔗 New socket connection: ${socket.id}`);
    const req = socket.request as any;
    const userId: string = req.session.userId;

    socket.join(userId);
    logger.info(`🛋️ User ${userId} joined personal room`);

    socket.on(EVENTS.PRIVATE_MESSAGE, async ({ to, message }) => {
      try {
        if (!to || !message) {
          logger.warn(`⚠️ Invalid message payload from ${userId}`);
          return;
        }

        // Save message in MongoDB
        const chatDoc = await ChatModel.create({
          from: userId,
          to,
          message,
        });

        logger.info(`💬 ${userId} -> ${to}: ${message}`);

        // Emit to recipient
        io.to(to).emit(EVENTS.PRIVATE_MESSAGE, {
          from: userId,
          message,
          timestamp: chatDoc.timestamp,
        });

        // Optional: emit back to sender for UI updates
        io.to(userId).emit(EVENTS.PRIVATE_MESSAGE, {
          from: userId,
          to,
          message,
          timestamp: chatDoc.timestamp,
          self: true,
        });
      } catch (err) {
        logger.error(`❌ Failed to send/store message from ${userId}`, err);
      }
    });

    socket.on(EVENTS.DISCONNECT, () => {
      logger.info(`❌ User disconnected: ${userId}`);
    });
  });

  return io;
};
