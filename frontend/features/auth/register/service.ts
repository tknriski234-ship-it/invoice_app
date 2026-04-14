import { registerUserApi } from "./api";
import type { RegisterInput } from "./schema";

export async function registerService(data: RegisterInput) {
  const cleaned = {
    ...data,
    full_name: data.full_name.trim(),
    email: data.email.toLowerCase(),
  };

  return registerUserApi(cleaned);
}