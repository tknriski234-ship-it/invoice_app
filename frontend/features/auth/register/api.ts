import { env } from "@/config/env";
import type { RegisterInput } from "./schema";
import type { RegisterResponse } from "../types";

export async function registerUserApi(
  payload: RegisterInput
): Promise<RegisterResponse> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data : RegisterResponse | { detail?: string; message?: string } | null = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string };
    throw new Error(errorData.detail || errorData.message || "Register failed");
  }

  return data as RegisterResponse;
}