"use client";

import { useState } from "react";
import { updateInvoiceService } from "./service";
import { updateInvoiceSchema } from "./invoiceUpdate.schema";
import { getErrorMessage } from "@/lib/error";

export function useInvoiceUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpdateInvoice(token: string, input: unknown) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = updateInvoiceSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        setLoading(false);
        return;
      }

      const result = await updateInvoiceService(token, parsed.data);
      setSuccess(`Invoice updated: ${result.invoice_number}`);
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
    handleUpdateInvoice,
  };
}
