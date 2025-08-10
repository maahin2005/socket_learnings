import winston from "winston";
import { Request, Response, NextFunction } from "express";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
  level: "debug",
  format: logFormat,
  defaultMeta: { service: "admin-panel-api" },
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
});

// Express middleware for logging HTTP requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const logLevel = statusCode >= 400 ? "error" : "info";
    logger.log({
      level: logLevel,
      message: `${method} ${originalUrl} ${statusCode}`,
      meta: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });
  });
  next();
};
