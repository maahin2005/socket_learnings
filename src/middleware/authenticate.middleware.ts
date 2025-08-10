import { Response, NextFunction } from "express";
import { ApiResponse, AuthenticatedRequest } from "../types/api";
import { UserModel } from "../models/users.model";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Authenticating user...");
    // Check if user is authenticated via session
    if (!req.session?.isAuthenticated || !req.session?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "No valid session found",
      });
      return;
    }

    // Get user from database
    const user = await UserModel.findById(req.session.userId);

    if (!user) {
      // Clear invalid session
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });

      res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "User not found or inactive",
      });
      return;
    }

    // Attach user to request
    req.user = user.toJSON();

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: "Internal server error",
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Optional authentication user:", req.session);
    if (req.session?.isAuthenticated && req.session?.userId) {
      console.log("Optional authentication user:", req.session.userId);
      const user = await UserModel.findById(req.session.userId);
      console.log("Optional authentication user:", user);
      if (user) {
        req.user = user.toJSON();
      }
    }
    next();
  } catch (error) {
    console.error("Optional authentication error:", error);
    next();
  }
};
