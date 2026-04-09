import { registerSchema } from "../schema/register-schema";
import { RegisterPayload, RegisterResponse } from "../types";
import { API_BASE_URL } from "@/lib/constants";

export async function registerUser(
  registerRequest: RegisterPayload,
): Promise<RegisterResponse> {
  const payload = registerSchema.parse(registerRequest);
  const response = await fetch(`${API_BASE_URL}/users/create`, {
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
