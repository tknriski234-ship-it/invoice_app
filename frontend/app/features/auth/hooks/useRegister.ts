"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../service/register";
import { RegisterRequest } from "../schema/register-schema";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser(data);
      setSuccess("Account created successfully. Please log in.");
      router.push("/account/login");
    } catch (registerError: unknown) {
      if (registerError instanceof Error) {
        setError(registerError.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    success,
    loading,
    handleRegister,
  };
}
