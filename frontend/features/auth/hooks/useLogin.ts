"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../service/login";
import { LoginPayload } from "../types";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginPayload) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(data);
      localStorage.setItem("token", response.access_token);
      router.push("/dashboard");
    } catch (loginError: unknown) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
}
