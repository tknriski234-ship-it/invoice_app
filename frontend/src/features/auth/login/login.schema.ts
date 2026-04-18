import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../../constants/constants";

export const LoginSchema = z.object({
  email: z.email({
    message: "Email tidak valid",
  }),

  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      message: `Minimal ${PASSWORD_MIN_LENGTH} karakter`,
    })
    .max(PASSWORD_MAX_LENGTH, {
      message: `Maksimal ${PASSWORD_MAX_LENGTH} karakter`,
    })
    .trim(),
});

export type LoginInput = z.infer<typeof LoginSchema>;