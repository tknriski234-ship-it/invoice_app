import { getInvoiceDetailApi } from "./invoiceGetDetail.api";

export async function getInvoiceDetailService(
  token: string,
  publicId: string
) {
  return getInvoiceDetailApi(token, publicId.trim());
}