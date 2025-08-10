import { z } from "zod";

export const userDataValidationSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type UserDataValidationSchema = z.infer<typeof userDataValidationSchema>;
