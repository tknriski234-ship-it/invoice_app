import { env } from "@/config/env";
import type { DeleteInvoiceInput } from "./schema";

export type DeleteInvoiceResponse = {
  message: string;
};

export async function deleteInvoiceApi(
  token: string,
  payload: DeleteInvoiceInput,
): Promise<DeleteInvoiceResponse> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/invoices/${payload.publicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data: DeleteInvoiceResponse | { detail?: string; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail || errorData?.message || "Delete invoice failed",
    );
  }

  return data as DeleteInvoiceResponse;
}
