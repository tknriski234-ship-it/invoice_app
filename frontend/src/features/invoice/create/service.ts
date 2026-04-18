import { createInvoiceApi } from "./invoiceCreate.api";
import type { CreateInvoice } from "./invoiceCreate.schema";

export async function createInvoiceService(
  token: string,
  data: CreateInvoice,
) {
  const cleaned = {
    ...data,
    title: data.title.trim(),
  };

  return createInvoiceApi(token, cleaned);
}
