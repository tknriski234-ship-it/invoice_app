import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../../constants/Register-constants";


export const LoginSchema = z.object({
    email: z.email({
        message: "Invalid email address",
    }),
    password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH, {
        message: "Password must be between " + PASSWORD_MIN_LENGTH + " and " + PASSWORD_MAX_LENGTH + " characters",
    }),
});

export type LoginInput= z.infer<typeof LoginSchema>;