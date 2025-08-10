// src/types/express.d.ts
import "express";

// Extend Express Request interface to include 'timestamp'
declare global {
  namespace Express {
    interface Request {
      timestamp?: string;
    }
  }
}
