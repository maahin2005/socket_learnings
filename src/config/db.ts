import mongoose from "mongoose";
import { envConfig } from "./env";
import { logger } from "../middleware/logger.middleware";

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(envConfig.mongodbUri);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if connection fails
  }
};
// Export the connection function
export const db = {
  connect: connectToDatabase,
};

export default db;
