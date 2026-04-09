export const APP_NAME = "Invoice App";

export const API_BASE_URL = "http://localhost:8000";

export const AUTH_TOKEN_KEY = "token";

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;
