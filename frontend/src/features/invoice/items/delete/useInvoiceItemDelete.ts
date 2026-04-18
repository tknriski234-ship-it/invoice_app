"use client";

import { useState } from "react";
import { deleteInvoiceItemService } from "./services";
import {
  deleteInvoiceItemSchema,
  DeleteInvoiceItemInput,
} from "./invoiceItemDelete.schema";
import { getErrorMessage } from "@/lib/error";

export function useInvoiceItemDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleDeleteInvoiceItem(input: DeleteInvoiceItemInput) { //if (!confirm("Yakin mau hapus item ini?")) return; tambahin di ui nanti
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = deleteInvoiceItemSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized");
        return;
      }

      const result = await deleteInvoiceItemService(token, parsed.data);

      setSuccess(result.message);
      return result; // konsisten sama add item
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
    handleDeleteInvoiceItem,
  };
}