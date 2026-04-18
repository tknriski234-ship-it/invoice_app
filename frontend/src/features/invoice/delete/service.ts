import { deleteInvoiceApi } from "./invoiceDelete.api";
import type { DeleteInvoiceInput } from "./invoiceDelete.schema";

export async function deleteInvoiceService(
  token: string,
  data: DeleteInvoiceInput,
) {
  const cleaned = {
    ...data,
    publicId: data.publicId.trim(),
  };

  return deleteInvoiceApi(token, cleaned);
}
