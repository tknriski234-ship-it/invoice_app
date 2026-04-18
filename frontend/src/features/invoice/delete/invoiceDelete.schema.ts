import { z } from "zod";

export const deleteInvoiceSchema = z.object({
  publicId: z.string().min(1, {
    message: "Invoice public id is required",
  }),
});

export type DeleteInvoiceInput = z.infer<typeof deleteInvoiceSchema>;
