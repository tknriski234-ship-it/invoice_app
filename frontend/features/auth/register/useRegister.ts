"use client";

import { useState } from "react";
import { RegisterSchema } from "./schema";
import { registerService } from "./service";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(input: unknown) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. VALIDASI (schema)
      const parsed = RegisterSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      // 2. CALL SERVICE
      const result = await registerService(parsed.data);

      // 3. SUCCESS STATE
      setSuccess(`Register success for ${result.email}`);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong");
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