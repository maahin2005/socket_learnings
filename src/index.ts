import express from "express";
import { envConfig } from "./config/env";
import { logger } from "./middleware/logger.middleware";
import db from "./config/db";

const PORT = envConfig.port || 9090;
const server = express();

const startServer = async () => {
  await db.connect();
  server.listen(PORT, () => {
    try {
      logger.info(`Server is running on port ${PORT}`);
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
