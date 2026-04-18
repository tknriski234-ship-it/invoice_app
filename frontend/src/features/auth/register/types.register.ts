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

export type RegisterResponse = UserProfile;