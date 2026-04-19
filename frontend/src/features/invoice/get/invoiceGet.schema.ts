import { z } from "zod";

export const InvoiceSchemaOut = z.object({
  invoice_number: z.string(),
  title: z.string(),
  amount: z.string(), // dari backend: "0.00"
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  issued_date: z.string(), // "2026-04-19"
  due_date: z.string(),
  created_at: z.string(), // ISO datetime
  updated_at: z.string(),
});

export const InvoiceListSchema = z.array(InvoiceSchemaOut);