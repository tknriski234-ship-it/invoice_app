import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(3),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(8),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
});
