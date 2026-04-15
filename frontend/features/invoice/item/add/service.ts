import { addInvoiceItemApi } from "./api";
import type { InvoiceItemAddInput } from "./schema";

export async function addInvoiceItemService(
  publicId: string,
  token: string,
  data: InvoiceItemAddInput,
) {
  const cleaned = {
    ...data,
    title: data.title.trim(),
    description: data.description?.trim() || null,
  };

  return addInvoiceItemApi(publicId, token, cleaned);
}
