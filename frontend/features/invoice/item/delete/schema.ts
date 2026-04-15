import { z } from "zod";

export const deleteInvoiceItemSchema = z.object({
  itemPublicId: z.string().min(1, {
    message: "Invoice item public id is required",
  }),
});

export type DeleteInvoiceItemInput = z.infer<typeof deleteInvoiceItemSchema>;
