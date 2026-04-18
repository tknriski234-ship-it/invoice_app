import { z } from "zod";

export const updateInvoiceItemSchema = z.object({
  itemPublicId: z.string().min(1, {
    message: "Invoice item public id is required",
  }),
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

export type UpdateInvoiceItemInput = z.infer<typeof updateInvoiceItemSchema>;
