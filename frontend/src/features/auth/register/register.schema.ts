import { z } from "zod";
import { 
    PASSWORD_MAX_LENGTH, 
    PASSWORD_MIN_LENGTH, 
    FULL_NAME_MAX_LENGTH, 
    FULL_NAME_MIN_LENGTH 
} from "../../../constants/constants";

export const RegisterSchema = z.object({
  full_name: z.string().min(FULL_NAME_MIN_LENGTH).max(FULL_NAME_MAX_LENGTH, {
    message: `Minimal ${FULL_NAME_MIN_LENGTH} karakter`
  }),
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH, {
    message: `Maksimal ${PASSWORD_MAX_LENGTH} karakter`,
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

