import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model("User", userSchema);
