import { z } from "zod";

export const deleteInvoiceSchema = z.object({
  publicId: z.uuid({
    message: "Invalid UUID format",
  }),
});

export type DeleteInvoiceInput = z.infer<typeof deleteInvoiceSchema>;