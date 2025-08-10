import express from "express";
import { envConfig } from "./config/env";
import { logger, requestLogger } from "./middleware/logger.middleware";
import db from "./config/db";
import { sessionConfig } from "./config/session";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.middleware";

const PORT = envConfig.port || 9090;
const server = express();

server.use(express.json({ limit: "5mb" })); // Increased limit for larger JSON payloads
server.use(express.urlencoded({ extended: true, limit: "5mb" }));
server.use(sessionConfig);
server.use(requestLogger);
server.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  next();
});

server.get("/", (_, res: any) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error Handling
server.use(notFoundHandler);
server.use(errorHandler);

const startServer = async () => {
  try {
    await db.connect();
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`⏰ Started at: ${new Date().toISOString()}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
