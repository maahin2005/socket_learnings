import { UserModel } from "../models/users.model";
import { ChatModel } from "../models/chat.model";
import { User } from "../types/index.model";
import { ApiError } from "../utils/apiError";

export const userSevice = {
  me: async (userId: string) => {
    if (!userId) {
      throw new ApiError("User ID is required");
    }
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      throw new ApiError("User not found");
    }
    return {
      success: true,
      message: "User data fetched successfully",
      data: user,
    };
  },

  update: async (userId: string, data: Partial<User>) => {
    if (!userId) {
      throw new ApiError("User ID is required");
    }
    const user = await UserModel.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new ApiError("User not found");
    }
    return {
      success: true,
      message: "User data updated successfully",
      data: user,
    };
  },

  chatHistory: async (userId: string) => {
    if (!userId) {
      throw new ApiError("User ID is required");
    }
    const chats = await ChatModel.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .sort({ timestamp: 1 })
      .lean();

    return {
      success: true,
      message: "Chats retrieved successfully!",
      data: chats,
    };
  },

  conversationWith: async (userId: string, peerId: string) => {
    if (!userId || !peerId) {
      throw new ApiError("User ID and peer ID are required");
    }
    const chats = await ChatModel.find({
      $or: [
        { from: userId, to: peerId },
        { from: peerId, to: userId },
      ],
    })
      .sort({ timestamp: 1 })
      .lean();

    return {
      success: true,
      message: "Conversation retrieved successfully!",
      data: chats,
    };
  },

  conversationPeers: async (userId: string) => {
    if (!userId) {
      throw new ApiError("User ID is required");
    }
    const peers = await ChatModel.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }],
        },
      },
      {
        $project: {
          peer: {
            $cond: [{ $eq: ["$from", userId] }, "$to", "$from"],
          },
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: "$peer",
          lastMessageAt: { $max: "$timestamp" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    return {
      success: true,
      message: "Conversation peers retrieved successfully!",
      data: peers.map((p) => ({
        peerId: p._id,
        lastMessageAt: p.lastMessageAt,
      })),
    };
  },

  delete: async (userId: string) => {
    if (!userId) {
      throw new ApiError("User ID is required");
    }
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError("User not found");
    }
    return { success: true, message: "User deleted successfully" };
  },
};
export default userSevice;
