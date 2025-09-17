import { Request } from "express";
import { User } from "./index.model";

// Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | { message?: string; details?: any } | any[];
}

// Request interfaces
export interface AuthenticatedRequest extends Request {
  user?: User & { id?: string }; // Ensure id is present for controller compatibility
  session: Request["session"] & {
    userId?: string;
    isAuthenticated?: boolean;
  };
}
