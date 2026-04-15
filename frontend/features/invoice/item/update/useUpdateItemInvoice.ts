"use client";

import { useState } from "react";
import { updateInvoiceItemService } from "./service";
import { updateInvoiceItemSchema } from "./schema";

export function useUpdateItemInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpdateInvoiceItem(token: string, input: unknown) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = updateInvoiceItemSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const result = await updateInvoiceItemService(token, parsed.data);
      setSuccess(`Invoice item updated: ${result.title}`);
      return result;
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
    handleUpdateInvoiceItem,
  };
}
