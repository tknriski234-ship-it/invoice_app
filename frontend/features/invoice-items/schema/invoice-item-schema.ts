import { z } from "zod";

export const createInvoiceItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().gt(0),
  unit_price: z.coerce.number().gt(0),
});

export const updateInvoiceItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  quantity: z.coerce.number().gt(0),
  unit_price: z.coerce.number().gt(0),
});
