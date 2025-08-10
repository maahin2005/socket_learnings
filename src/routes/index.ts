import { Response, Router } from "express";
import { ApiResponse } from "../types/api";
import authRoutes from "./auth.routes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res: Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    message: "Server APIs are running",
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

router.use("/auth", authRoutes);

export default router;
