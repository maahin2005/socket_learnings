import { Schema, model } from "mongoose";
import { User } from "../types/index.model";

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model("User", userSchema);
