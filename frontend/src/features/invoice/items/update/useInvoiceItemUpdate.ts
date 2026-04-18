"use client";

import { useState } from "react";
import { updateInvoiceItemService } from "./service";
import {
  updateInvoiceItemSchema,
  UpdateInvoiceItemInput,
} from "./invoiceItemUpdate.schema";
import { getErrorMessage } from "@/lib/error";

export function useUpdateItemInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpdateInvoiceItem(input: UpdateInvoiceItemInput) {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = updateInvoiceItemSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      const result = await updateInvoiceItemService(token, parsed.data);

      setSuccess(`Invoice item updated: ${result.title}`);
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
    handleUpdateInvoiceItem,
  };
}