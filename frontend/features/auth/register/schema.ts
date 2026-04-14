import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, FULL_NAME_MAX_LENGTH, FULL_NAME_MIN_LENGTH } from "../../../constants/Register-constants";

export const RegisterSchema = z.object({
  full_name: z.string().min(FULL_NAME_MIN_LENGTH).max(FULL_NAME_MAX_LENGTH, {
    message: "Full name must be between " + FULL_NAME_MIN_LENGTH + " and " + FULL_NAME_MAX_LENGTH + " characters",
  }),
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH, {
    message: "Password must be between " + PASSWORD_MIN_LENGTH + " and " + PASSWORD_MAX_LENGTH + " characters",
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

