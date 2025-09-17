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

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Error while updating user data!",
        error: "User ID is required",
      });
    }
    const data = req.body;
    const result = await userSevice.update(userId, data);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Update user data error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating user data!",
      error: error.message || "Internal server error",
    });
  }
};

export const chatHistory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Error while fetching chat history!",
        error: "User ID is required",
      });
    }
    const result = await userSevice.chatHistory(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Fetch chat history error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching chat history!",
      error: error.message || "Internal server error",
    });
  }
};

export const conversationWith = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    const { peerId } = req.params as { peerId: string };
    if (!userId || !peerId) {
      return res.status(400).json({
        success: false,
        message: "Error while fetching conversation!",
        error: "User ID and peerId are required",
      });
    }
    const result = await userSevice.conversationWith(userId, peerId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Fetch conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching conversation!",
      error: error.message || "Internal server error",
    });
  }
};

export const conversationPeers = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Error while fetching peers!",
        error: "User ID is required",
      });
    }
    const result = await userSevice.conversationPeers(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Fetch peers error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching peers!",
      error: error.message || "Internal server error",
    });
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Error while deleting user!",
        error: "User ID is required",
      });
    }
    const result = await userSevice.delete(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting user!",
      error: error.message || "Internal server error",
    });
  }
};
