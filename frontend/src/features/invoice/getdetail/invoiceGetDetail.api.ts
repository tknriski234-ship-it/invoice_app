import { env } from "@/config/env";
import { InvoiceSchemaOut } from "./invoiceGetDetail.schema";

export async function getInvoiceDetailApi(
  token: string,
  publicId: string
) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/invoices/${publicId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const raw = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = raw as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Get invoice detail failed"
    );
  }

  // ✅ validasi pakai schema (single object)
  const parsed = InvoiceSchemaOut.safeParse(raw);

  if (!parsed.success) {
    console.error("Schema error:", parsed.error);
    throw new Error("Response gak sesuai schema");
  }

  return parsed.data;
}