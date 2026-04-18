import { updateInvoiceItemApi } from "./invoiceItemUpdate.api";
import type { UpdateInvoiceItemInput } from "./invoiceItemUpdate.schema";

export async function updateInvoiceItemService(
  token: string,
  data: UpdateInvoiceItemInput,
) {
  const cleaned = {
    ...data,
    itemPublicId: data.itemPublicId.trim(),
    title: data.title.trim(),
    description: data.description?.trim() || null,
  };

  return updateInvoiceItemApi(token, cleaned);
}
