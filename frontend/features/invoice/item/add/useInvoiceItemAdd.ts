"use client";

import { useState } from "react";
import { InvoiceItemAddSchema } from "./schema";
import { addInvoiceItemService } from "./service";

export function useInvoiceItemAdd() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleAddInvoiceItem(
    publicId: string,
    token: string,
    input: unknown,
  ) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = InvoiceItemAddSchema.safeParse(input);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      const result = await addInvoiceItemService(publicId, token, parsed.data);
      setSuccess(`Invoice item added: ${result.title}`);
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
    handleAddInvoiceItem,
  };
}
