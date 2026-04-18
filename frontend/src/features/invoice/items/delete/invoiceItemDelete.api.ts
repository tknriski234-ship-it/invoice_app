import { env } from "@/config/env";
import type { DeleteInvoiceItemInput } from "./invoiceItemDelete.schema";
import { DeleteInvoiceItemResponse } from "./invoiceItemDelete.types";

export async function deleteInvoiceItemApi(
  token: string,
  payload: DeleteInvoiceItemInput,
): Promise<DeleteInvoiceItemResponse> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/invoices/items/${payload.itemPublicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data:
    | DeleteInvoiceItemResponse
    | { detail?: string; message?: string }
    | null = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Delete invoice item failed",
    );
  }

  return data as DeleteInvoiceItemResponse;
}
