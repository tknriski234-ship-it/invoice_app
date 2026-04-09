import { z } from "zod";
import {
  createInvoiceItemSchema,
  updateInvoiceItemSchema,
} from "./schema/invoice-item-schema";

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

export type InvoiceItemCreatePayload = z.infer<typeof createInvoiceItemSchema>;
export type InvoiceItemUpdatePayload = z.infer<typeof updateInvoiceItemSchema>;

