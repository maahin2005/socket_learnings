import { UserModel } from "../models/users.model";
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
    return { success: true, user };
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
