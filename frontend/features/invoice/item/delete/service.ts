import { deleteInvoiceItemApi } from "./api";
import type { DeleteInvoiceItemInput } from "./schema";

export async function deleteInvoiceItemService(
  token: string,
  data: DeleteInvoiceItemInput,
) {
  const cleaned = {
    ...data,
    itemPublicId: data.itemPublicId.trim(),
  };

  return deleteInvoiceItemApi(token, cleaned);
}
