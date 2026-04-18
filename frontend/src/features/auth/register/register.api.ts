import { env } from "@/config/env";
import { RegisterInput } from "./register.schema";
import { RegisterResponse } from "./types.register";

export async function registerUserApi(payload:RegisterInput)
: Promise <RegisterResponse> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/create`,{
    method : "POST",
    headers : {
      "content-Type" : "application/json"
    },
    body : JSON.stringify(payload)
  });

  const data : RegisterResponse | {detail?: string; message?:string} | null = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data as {detail?:string; message?:string;} | null;
      throw new Error(err?.detail || err?.message || "Register failed");
  }

  return data as RegisterResponse

}