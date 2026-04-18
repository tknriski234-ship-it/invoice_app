"use client";

import { useState } from "react";
import { createInvoiceService } from "./service";
import { createInvoiceSchema } from "./invoiceCreate.schema";
import { getErrorMessage } from "@/lib/error";

export function useInvoiceCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
    
  async function handleCreateInvoice(token:string, input:unknown) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try{
      const parsed = createInvoiceSchema.safeParse(input)

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Invalid input")
        setLoading(false);
        return;
      }

      const result = await createInvoiceService(token, parsed.data)
      setSuccess(`Invoice created: ${result.invoice_number}`)
      } catch (err : unknown) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
        
    }

    return {
      loading,
      error,
      success,
      handleCreateInvoice
    }

}