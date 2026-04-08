import { z } from "zod";
import { UserProfile } from "../auth/types";
import { Invoice } from "../invoice/type";
import { dashboardSearchSchema } from "./schema/dashboard-schema";

export type DashboardSearchPayload = z.infer<typeof dashboardSearchSchema>;

export type DashboardState = {
  user: UserProfile | null;
  invoices: Invoice[];
  loading: boolean;
  error: string;
  createLoading: boolean;
  createError: string;
};
