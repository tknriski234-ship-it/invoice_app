"use client";

import { useState } from "react";
import { deleteInvoiceService } from "./service";
import { deleteInvoiceSchema } from "./schema";
import { getErrorMessage } from "@/lib/error";

export function useInvoiceDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleDeleteInvoice(token: string, input: unknown) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = deleteInvoiceSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        setLoading(false);
        return;
      }

      const result = await deleteInvoiceService(token, parsed.data);
      setSuccess(result.message);
      return result;
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
    handleDeleteInvoice,
  };
}
