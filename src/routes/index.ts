import { Response, Router } from "express";
import { ApiResponse } from "../types/api";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import { authenticate } from "../middleware/authenticate.middleware";

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
router.use("/user", authenticate, userRoutes);

export default router;
