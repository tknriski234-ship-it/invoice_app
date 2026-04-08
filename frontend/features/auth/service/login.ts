import { loginSchema } from "../schema/login-schema";
import { LoginPayload, LoginResponse } from "../types";

const AUTH_API_BASE_URL = "http://localhost:8000";

export async function loginUser(
  loginRequest: LoginPayload,
): Promise<LoginResponse> {
  const payload = loginSchema.parse(loginRequest);
  const formData = new URLSearchParams();
  formData.append("username", payload.email);
  formData.append("password", payload.password);

  const response = await fetch(`${AUTH_API_BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Login failed";

    try {
      const errorData = (await response.json()) as { detail?: string };
      if (typeof errorData.detail === "string" && errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep the fallback message when the response is not JSON.
    }

    throw new Error(message);
  }

  const data: LoginResponse = await response.json();
  return data;
}
