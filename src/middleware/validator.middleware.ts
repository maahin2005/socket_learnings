import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiError } from "../utils/apiError";

type ZodSchema = z.ZodType<{
  body?: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
}>;

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        next(new ApiError("Validation Error", 400, errors));
      } else {
        next(error);
      }
    }
  };
};
