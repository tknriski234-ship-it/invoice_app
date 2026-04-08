import { z } from "zod";

export const dashboardSearchSchema = z.object({
  query: z.string().optional().default(""),
});
