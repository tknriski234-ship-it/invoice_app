import { env } from "@/config/env";
import type { Invoice } from "./invoiceUpdate.types";
import type { UpdateInvoiceInput } from "./invoiceUpdate.schema";

export async function updateInvoiceApi(
  token: string,
  payload: UpdateInvoiceInput,
): Promise<Invoice> {
  const { publicId, ...body } = payload;

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/${publicId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data: Invoice | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Update invoice failed",
    );
  }

  return data as Invoice;
}
