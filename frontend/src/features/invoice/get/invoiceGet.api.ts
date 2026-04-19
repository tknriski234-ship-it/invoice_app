import { env } from "@/config/env";
import { InvoiceListSchema } from "./invoiceGet.schema";

export async function getMyInvoicesApi(token: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = raw as { detail?: string; message?: string } | null;
    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Get my invoices failed"
    );
  }

  // 🔥 validasi pake schema lo
  const parsed = InvoiceListSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("Schema error:", parsed.error);
    throw new Error("Response gak sesuai schema");
  }

  return parsed.data;
}