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
