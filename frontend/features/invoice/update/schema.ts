import { z } from "zod";

export const updateInvoiceSchema = z.object({
  publicId: z.string().min(1, {
    message: "Invoice public id is required",
  }),
  title: z.string().trim().min(1, {
    message: "Title is required",
  }),
  due_date: z.iso.date(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
});

export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
