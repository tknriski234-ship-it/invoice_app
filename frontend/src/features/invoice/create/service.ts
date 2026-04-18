import { createInvoiceApi } from "./invoiceCreate.api";
import type { createInvoice } from "./invoiceCreate.schema";

export async function createInvoiceService(
  token: string,
  data: createInvoice,
) {
  const cleaned = {
    ...data,
    title: data.title.trim(),
  };

  return createInvoiceApi(token, cleaned);
}
