import { registerSchema } from "../schema/register-schema";
import { RegisterPayload, RegisterResponse } from "../types";

const AUTH_API_BASE_URL = "http://localhost:8000";

export async function registerUser(
  registerRequest: RegisterPayload,
): Promise<RegisterResponse> {
  const payload = registerSchema.parse(registerRequest);
  const response = await fetch(`${AUTH_API_BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }

  const data: RegisterResponse = await response.json();
  return data;
}
