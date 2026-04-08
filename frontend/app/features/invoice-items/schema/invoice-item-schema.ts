export type InvoiceItem = {
  id: number;
  public_id: string;
  invoice_id: number;
  title: string;
  description: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceItemCreateRequest = {
  title: string;
  description?: string | null;
  quantity: number;
  unit_price: number;
};

export type InvoiceItemUpdateRequest = {
  title: string;
  description?: string | null;
  quantity: number;
  unit_price: number;
};

export type InvoiceItemDeleteResponse = {
  message: string;
};
