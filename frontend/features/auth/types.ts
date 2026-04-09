import { z } from "zod";
import { changePasswordSchema, deleteAccountSchema, updateProfileSchema } from "./schema/account-schema";
import { loginSchema } from "./schema/login-schema";
import { registerSchema } from "./schema/register-schema";

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
export type DeleteAccountPayload = z.infer<typeof deleteAccountSchema>;
export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

export type UserProfile = {
  id: number;
  public_id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: UserProfile;
};

export type RegisterResponse = UserProfile;
