import { deleteInvoiceApi } from "./api";
import type { DeleteInvoiceInput } from "./schema";

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
