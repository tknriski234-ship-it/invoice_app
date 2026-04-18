import { loginUserApi } from "./login.api";
import { LoginInput } from "./login.schema";

export async function loginService(data:LoginInput) {
  const cleaned = {
    ...data,
    email:data.email.trim().toLowerCase()
  };

  return loginUserApi(cleaned);
  
}