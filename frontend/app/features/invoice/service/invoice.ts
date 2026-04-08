import {
  Invoice,
  InvoiceCreateRequest,
  InvoiceDeleteResponse,
  InvoiceUpdateRequest,
} from "../schema/invoice-schema";

const INVOICE_API_BASE_URL = "http://localhost:8000";

export async function createInvoice(
  token: string,
  payload: InvoiceCreateRequest,
): Promise<Invoice> {
  const response = await fetch(`${INVOICE_API_BASE_URL}/invoice/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create invoice");
  }

  const data: Invoice = await response.json();
  return data;
}

export async function getMyInvoices(token: string): Promise<Invoice[]> {
  const response = await fetch(`${INVOICE_API_BASE_URL}/invoice/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load invoices");
  }

  const data: Invoice[] = await response.json();
  return data;
}

export async function getInvoiceDetail(
  token: string,
  publicId: string,
): Promise<Invoice> {
  const response = await fetch(`${INVOICE_API_BASE_URL}/invoice/${publicId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load invoice detail");
  }

  const data: Invoice = await response.json();
  return data;
}

export async function updateInvoice(
  token: string,
  publicId: string,
  payload: InvoiceUpdateRequest,
): Promise<Invoice> {
  const response = await fetch(`${INVOICE_API_BASE_URL}/invoice/${publicId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update invoice");
  }

  const data: Invoice = await response.json();
  return data;
}

export async function deleteInvoice(
  token: string,
  publicId: string,
): Promise<InvoiceDeleteResponse> {
  const response = await fetch(`${INVOICE_API_BASE_URL}/invoice/${publicId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete invoice");
  }

  const data: InvoiceDeleteResponse = await response.json();
  return data;
}
