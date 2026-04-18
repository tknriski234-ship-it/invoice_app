"use client";

import { useState } from "react";
import { registerService } from "./service";
import { getErrorMessage } from "@/lib/error";
import { RegisterSchema, RegisterInput } from "./register.schema";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(input: RegisterInput) {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = RegisterSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const result = await registerService(parsed.data);

      setSuccess(`Register berhasil ${result.email}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    handleRegister,
  };
}