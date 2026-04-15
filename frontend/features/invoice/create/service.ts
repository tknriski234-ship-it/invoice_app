import { createInvoiceApi } from "./api";
import type { createInvoice } from "./schema";

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
