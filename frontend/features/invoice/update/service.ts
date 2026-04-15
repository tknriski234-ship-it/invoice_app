import { updateInvoiceApi } from "./api";
import type { UpdateInvoiceInput } from "./schema";

export async function updateInvoiceService(
  token: string,
  data: UpdateInvoiceInput,
) {
  const cleaned = {
    ...data,
    publicId: data.publicId.trim(),
    title: data.title.trim(),
  };

  return updateInvoiceApi(token, cleaned);
}
