import { getMyInvoicesApi } from "./invoiceGet.api";

export async function getMyInvoicesService(token: string) {
  return getMyInvoicesApi(token);
}