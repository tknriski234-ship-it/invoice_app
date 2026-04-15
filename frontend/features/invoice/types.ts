export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export type Invoice = {
  id: number;
  public_id: string;
  user_id: number;
  invoice_number: string;
  title: string;
  amount: string;
  status: InvoiceStatus;
  issued_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
};
