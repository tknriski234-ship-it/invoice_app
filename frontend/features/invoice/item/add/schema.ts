import { z } from "zod";

export const InvoiceItemAddSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Title is required",
  }),
  description: z.string().trim().optional().nullable(),
  quantity: z.coerce.number().gt(0, {
    message: "Quantity must be greater than 0",
  }),
  unit_price: z.coerce.number().gt(0, {
    message: "Unit price must be greater than 0",
  }),
});

export type InvoiceItemAddInput = z.infer<typeof InvoiceItemAddSchema>;
