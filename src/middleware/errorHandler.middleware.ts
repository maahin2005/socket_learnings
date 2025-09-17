import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, number>;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error("Error:", error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle MongoDB duplicate key error
  if (error.code === 11000 && error.keyPattern) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }

  // Handle MongoDB validation error
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  }

  // Handle MongoDB cast error
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  const response: ApiResponse = {
    success: false,
    message,
  };

  // Only include error details in non-production environments
  if (process.env.NODE_ENV !== "production") {
    if ((error as any).errors) {
      response.error = (error as any).errors;
    } else if (error.message) {
      response.error = error.message;
    }
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: `${req.method} ${req.originalUrl} not found`,
  });
};
