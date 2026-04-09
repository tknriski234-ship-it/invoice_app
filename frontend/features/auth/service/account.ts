import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "../schema/account-schema";

import { ApiMessageResponse } from "@/types/api-types";

import {
  ChangePasswordPayload,
  DeleteAccountPayload,
  UpdateProfilePayload,
  UserProfile,
} from "../types";

import { API_BASE_URL } from "@/lib/constants";

export async function getCurrentUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
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
  const response = await fetch(`${API_BASE_URL}/users/me`, {
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
): Promise<ApiMessageResponse> {
  const dataPayload = deleteAccountSchema.parse(payload);
  const response = await fetch(`${API_BASE_URL}/users/me`, {
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

  const data: ApiMessageResponse = await response.json();
  return data;
}

export async function changeCurrentUserPassword(
  token: string,
  payload: ChangePasswordPayload,
): Promise<ApiMessageResponse> {
  const dataPayload = changePasswordSchema.parse(payload);
  const response = await fetch(`${API_BASE_URL}/users/me/password`, {
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

  const data: ApiMessageResponse = await response.json();
  return data;
}
