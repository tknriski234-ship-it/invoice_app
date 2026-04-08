import {
  AccountMessageResponse,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
  UserProfile,
} from "../schema/account-schema";

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
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data: UserProfile = await response.json();
  return data;
}

export async function deleteCurrentUser(
  token: string,
  payload: DeleteAccountRequest,
): Promise<AccountMessageResponse> {
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }

  const data: AccountMessageResponse = await response.json();
  return data;
}

export async function changeCurrentUserPassword(
  token: string,
  payload: ChangePasswordRequest,
): Promise<AccountMessageResponse> {
  const response = await fetch(`${ACCOUNT_API_BASE_URL}/user/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }

  const data: AccountMessageResponse = await response.json();
  return data;
}
