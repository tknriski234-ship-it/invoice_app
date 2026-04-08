import {
  createInvoiceItemSchema,
  updateInvoiceItemSchema,
} from "../schema/invoice-item-schema";
import {
  InvoiceItem,
  InvoiceItemCreatePayload,
  InvoiceItemDeleteResponse,
  InvoiceItemUpdatePayload,
} from "../type";

const INVOICE_ITEM_API_BASE_URL = "http://localhost:8000";

export async function createInvoiceItem(
  token: string,
  invoicePublicId: string,
  payload: InvoiceItemCreatePayload,
): Promise<InvoiceItem> {
  const dataPayload = createInvoiceItemSchema.parse(payload);
  const response = await fetch(
    `${INVOICE_ITEM_API_BASE_URL}/invoice/${invoicePublicId}/items`,
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
    `${INVOICE_ITEM_API_BASE_URL}/invoice/${invoicePublicId}/items`,
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
    `${INVOICE_ITEM_API_BASE_URL}/invoice/items/${itemPublicId}`,
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
    `${INVOICE_ITEM_API_BASE_URL}/invoice/items/${itemPublicId}`,
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
): Promise<InvoiceItemDeleteResponse> {
  const response = await fetch(
    `${INVOICE_ITEM_API_BASE_URL}/invoice/items/${itemPublicId}`,
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

  const data: InvoiceItemDeleteResponse = await response.json();
  return data;
}
