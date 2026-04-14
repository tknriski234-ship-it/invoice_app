import { loginUserApi } from "./api";
import { LoginInput } from "./schema";

export async function loginService(data:LoginInput) {
  const cleaned = {
    ...data,
    email:data.email.trim().toLowerCase()
  };

  return loginUserApi(cleaned);
  
}