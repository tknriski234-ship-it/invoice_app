import {
  RegisterRequest,
  RegisterResponse,
} from "../schema/register-schema";

const AUTH_API_BASE_URL = "http://localhost:8000";

export async function registerUser(
  registerRequest: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await fetch(`${AUTH_API_BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }

  const data: RegisterResponse = await response.json();
  return data;
}
