import { z } from "zod";

export const loginValidationSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type LoginValidationSchema = z.infer<typeof loginValidationSchema>;
