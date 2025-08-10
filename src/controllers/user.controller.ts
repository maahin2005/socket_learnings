import { Response } from "express";
import { ApiResponse, AuthenticatedRequest } from "../types/api";
import userSevice from "../services/user.service";

export const myData = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Error while fetching user data!",
        error: "User ID is required",
      });
    }
    const result = await userSevice.me(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Fetch user data error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user data!",
      error: error.message || "Internal server error",
    });
  }
};
