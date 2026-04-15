import { env } from "@/config/env";
import type { InvoiceItemAddInput } from "./schema";
import type { InvoiceItem } from "../types";

export async function addInvoiceItemApi(
  publicId: string,
  token: string,
  payload: InvoiceItemAddInput,
): Promise<InvoiceItem> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/${publicId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: InvoiceItem | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Add invoice item failed",
    );
  }

  return data as InvoiceItem;
}
