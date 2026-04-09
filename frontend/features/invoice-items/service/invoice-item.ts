import {
  createInvoiceItemSchema,
  updateInvoiceItemSchema,
} from "../schema/invoice-item-schema";

import { ApiMessageResponse } from "@/types/api-types";

import {
  InvoiceItem,
  InvoiceItemCreatePayload,
  InvoiceItemUpdatePayload,
} from "../type";

import { API_BASE_URL } from "@/lib/constants";

export async function createInvoiceItem(
  token: string,
  invoicePublicId: string,
  payload: InvoiceItemCreatePayload,
): Promise<InvoiceItem> {
  const dataPayload = createInvoiceItemSchema.parse(payload);
  const response = await fetch(
    `${API_BASE_URL}/invoices/${invoicePublicId}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataPayload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create invoice item");
  }

  const data: InvoiceItem = await response.json();
  return data;
}

export async function getInvoiceItems(
  token: string,
  invoicePublicId: string,
): Promise<InvoiceItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/invoices/${invoicePublicId}/items`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load invoice items");
  }

  const data: InvoiceItem[] = await response.json();
  return data;
}

export async function getInvoiceItemDetail(
  token: string,
  itemPublicId: string,
): Promise<InvoiceItem> {
  const response = await fetch(
    `${API_BASE_URL}/invoices/items/${itemPublicId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load invoice item detail");
  }

  const data: InvoiceItem = await response.json();
  return data;
}

export async function updateInvoiceItem(
  token: string,
  itemPublicId: string,
  payload: InvoiceItemUpdatePayload,
): Promise<InvoiceItem> {
  const dataPayload = updateInvoiceItemSchema.parse(payload);
  const response = await fetch(
    `${API_BASE_URL}/invoices/items/${itemPublicId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataPayload),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update invoice item");
  }

  const data: InvoiceItem = await response.json();
  return data;
}

export async function deleteInvoiceItem(
  token: string,
  itemPublicId: string,
): Promise<ApiMessageResponse> {
  const response = await fetch(
    `${API_BASE_URL}/invoices/items/${itemPublicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete invoice item");
  }

  const data: ApiMessageResponse = await response.json();
  return data;
}
