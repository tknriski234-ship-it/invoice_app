import { apiFetch } from "@/lib/api";

export function getInvoice() {
  return apiFetch("/invoices/me", {
    method: "GET",
  })
}

export function getInvoiceDetail(publicId) {
  return apiFetch(`/invoices/${publicId}`, {
    method: "GET"
  })
}

export function getInvoiceItems(publicId) {
  return apiFetch(`/invoices/${publicId}/items`,{
    method : "GET"
    }
  )
}