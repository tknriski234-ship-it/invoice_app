import { registerUserApi } from "./register.api";
import type { RegisterInput } from "./register.schema";

export async function registerService(data: RegisterInput) {
  const cleaned = {
    ...data,
    full_name: data.full_name.trim(),
    email: data.email.toLowerCase(),
  };

  return registerUserApi(cleaned);
}