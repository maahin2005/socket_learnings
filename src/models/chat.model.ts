import mongoose, { Schema } from "mongoose";
import { IChat } from "../types/index.model";

const ChatSchema: Schema = new Schema<IChat>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);
