import { z } from "zod";

export const createInvoiceSchema = z
  .object({
    title: z.string().trim().min(1),
    issued_date: z.string().date(),
    due_date: z.string().date(),
  })
  .refine((data) => data.due_date >= data.issued_date, {
    message: "due_date must be greater than or equal to issued_date",
    path: ["due_date"],
  });

export const updateInvoiceSchema = z.object({
  title: z.string().trim().min(1),
  due_date: z.string().date(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
});
