"use client";

import { useState } from "react";
import { createInvoiceService } from "./service";
import { createInvoiceSchema, CreateInvoice } from "./invoiceCreate.schema";
import { getErrorMessage } from "@/lib/error";

export function useInvoiceCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreateInvoice(input: CreateInvoice) {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = createInvoiceSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      const result = await createInvoiceService(token, parsed.data);

      setSuccess(`Invoice created: ${result.invoice_number}`);
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
    handleCreateInvoice,
  };
}