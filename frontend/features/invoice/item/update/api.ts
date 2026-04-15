import { env } from "@/config/env";
import type { InvoiceItem } from "../types";
import type { UpdateInvoiceItemInput } from "./schema";

export async function updateInvoiceItemApi(
  token: string,
  payload: UpdateInvoiceItemInput,
): Promise<InvoiceItem> {
  const { itemPublicId, ...body } = payload;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/invoices/items/${itemPublicId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const data: InvoiceItem | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Update invoice item failed",
    );
  }

  return data as InvoiceItem;
}
