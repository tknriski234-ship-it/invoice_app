import { env } from "@/config/env";
import type { Invoice } from "../types";
import type { createInvoice } from "./schema";

export async function createInvoiceApi(
  token: string,
  payload: createInvoice,
): Promise<Invoice> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: Invoice | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Create invoice failed",
    );
  }

  return data as Invoice;
}
