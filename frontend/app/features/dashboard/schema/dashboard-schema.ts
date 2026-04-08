import { UserProfile } from "../../auth/schema/account-schema";
import { Invoice } from "../../invoice/schema/invoice-schema";

export type DashboardState = {
  user: UserProfile | null;
  invoices: Invoice[];
  loading: boolean;
  error: string;
  createLoading: boolean;
  createError: string;
};
