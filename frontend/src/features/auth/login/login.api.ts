import { env } from "@/config/env";
import { LoginInput } from "./login.schema";
import { LoginResponse } from "./login.types";

export async function loginUserApi(
  payload : LoginInput
): Promise<LoginResponse> {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/logins`, { //di backend masih pake logins nanti ganti hanya untuk test swagger fastapi,nanti ganti ke login beneran
      method : "POST",
      headers : {
          "content-Type" : "application/json",
        },
      body : JSON.stringify(payload),
    });

  const raw = await res.json().catch(() => null);

  if (!res.ok) {
    const err = raw as { detail?: string; message?: string; } | null;
    throw new Error(err?.detail || err?.message || "Login failed");
  }

  if (!raw || typeof raw !== "object" || !("access_token" in raw)) {
    throw new Error("Invalid response from server");
  }
  
  const data = raw as { access_token?: unknown };
    if (typeof data.access_token !== "string") {
    throw new Error("Invalid access_token format");
  } 
  return raw as LoginResponse
}

