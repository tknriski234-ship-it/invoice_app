import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "../schema/invoice-schema";
import {
  Invoice,
  InvoiceCreatePayload,
  InvoiceUpdatePayload,
} from "../type";

import { ApiMessageResponse } from "@/types/api-types";

import { API_BASE_URL } from "@/lib/constants";

export async function createInvoice(
  token: string,
  payload: InvoiceCreatePayload,
): Promise<Invoice> {
  const dataPayload = createInvoiceSchema.parse(payload);
  const response = await fetch(`${API_BASE_URL}/invoices/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create invoice");
  }

  const data: Invoice = await response.json();
  return data;
}

export async function getMyInvoices(token: string): Promise<Invoice[]> {
  const response = await fetch(`${API_BASE_URL}/invoices/me`, {
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
  const response = await fetch(`${API_BASE_URL}/invoices/${publicId}`, {
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
  payload: InvoiceUpdatePayload,
): Promise<Invoice> {
  const dataPayload = updateInvoiceSchema.parse(payload);
  const response = await fetch(`${API_BASE_URL}/invoices/${publicId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dataPayload),
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
): Promise<ApiMessageResponse> {
  const response = await fetch(`${API_BASE_URL}/invoices/${publicId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete invoice");
  }

  const data: ApiMessageResponse = await response.json();
  return data;
}
