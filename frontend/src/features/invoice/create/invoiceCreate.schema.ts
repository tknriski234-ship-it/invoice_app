import { z } from "zod";

export const createInvoiceSchema = z
  .object({
    title : z.string().trim().min(1),
    issued_date : z.iso.date(),
    due_date : z.iso.date()
  })
  .refine((data) => {
    return new Date(data.due_date) >= new Date(data.issued_date);
  },{message : "due_date must be greater than or equal to issued_date",
      path : ["due_date"],
  });

export type createInvoice = z.infer<typeof createInvoiceSchema>;

