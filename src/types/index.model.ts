import { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IChat extends Document {
  from: string; // sender userId
  to: string; // receiver userId
  message: string;
  timestamp: Date;
}
