import { env } from "@/config/env";
import type { LoginInput } from "./schema";
import type { LoginResponse } from "@/features/auth/types";

export async function loginUserApi(
  payload: LoginInput
): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", payload.email);
  formData.append("password", payload.password);

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data: LoginResponse | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(errorData?.detail || errorData?.message || "Login failed");
  }

  return data as LoginResponse;
}
