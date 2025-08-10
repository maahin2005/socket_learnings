import { Response } from "express";
import { authService } from "../services/auth.service";
import { ApiResponse, AuthenticatedRequest } from "../types/api";

export const login = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Error while Login!",
          error: "Username and password are required",
        });
    }
    const result = await authService.login({ username, password });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error while Login!",
        error: error.message || "Internal server error",
      });
  }
};
