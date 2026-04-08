import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "../schema/account-schema";
import {
  AccountMessageResponse,
  ChangePasswordPayload,
  DeleteAccountPayload,
  UpdateProfilePayload,
  UserProfile,
} from "../types";

const ACCOUNT_API_BASE_URL = "http://localhost:8000";

export async function getCurrentUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load user profile");
  }

  const data: UserProfile = await response.json();
  return data;
}

export async function updateCurrentUserProfile(
  token: string,
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const dataPayload = updateProfileSchema.parse(payload);
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data: UserProfile = await response.json();
  return data;
}

export async function deleteCurrentUser(
  token: string,
  payload: DeleteAccountPayload,
): Promise<AccountMessageResponse> {
  const dataPayload = deleteAccountSchema.parse(payload);
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }

  const data: AccountMessageResponse = await response.json();
  return data;
}

export async function changeCurrentUserPassword(
  token: string,
  payload: ChangePasswordPayload,
): Promise<AccountMessageResponse> {
  const dataPayload = changePasswordSchema.parse(payload);
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }

  const data: AccountMessageResponse = await response.json();
  return data;
}
