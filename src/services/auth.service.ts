import { UserModel } from "../models/users.model";
import { AuthLoginRequest } from "../types/auth";
import { ApiError } from "../utils/apiError";

export const authService = {
  login: async (data: AuthLoginRequest, session: any) => {
    const { username, password } = data;
    if (!username || !password) {
      throw new ApiError("Username and password are required");
    }

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      throw new ApiError("User not found! Please register first.");
    }

    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError("Invalid password");
    }

    // Create session
    session.userId = existingUser._id.toString();
    session.isAuthenticated = true;
    // Logic for user login
    return { success: true, message: "User logged in successfully" };
  },

  register: async (data: AuthLoginRequest, session: any) => {
    const { username, password } = data;
    if (!username || !password) {
      throw new ApiError("Username and password are required");
    }
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new ApiError("Username already exists");
    }
    const newUser = new UserModel({ username, password });
    await newUser.save();
    // Create session
    session.userId = newUser._id.toString();
    session.isAuthenticated = true;
    return { success: true, message: "User registered successfully" };
  },

  logout: async (session: any) => {
    if (!session.isAuthenticated) {
      throw new ApiError("User is not authenticated");
    }
    // Destroy session
    session.destroy((err: any) => {
      if (err) {
        throw new ApiError("Error while logging out");
      }
    });
    return { success: true, message: "User logged out successfully" };
  },
  isAuthenticated: (session: any) => {
    return session && session.isAuthenticated;
  },
};
