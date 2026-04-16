"use client";

import Link from "next/link";
import type { Invoice } from "@/features/invoice/types";

export default function InvoiceList({
  invoices,
  loading,
  error,
  deleteError,
  deleteSuccess,
  onDelete,
  deleteLoading,
}: {
  invoices: Invoice[];
  loading: boolean;
  error?: string | null;
  deleteError?: string | null;
  deleteSuccess?: string | null;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Invoices</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
      {deleteSuccess && (
        <p className="text-sm text-emerald-700">{deleteSuccess}</p>
      )}

      {loading ? (
        <p>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li
              key={invoice.public_id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{invoice.title}</p>
                <p className="text-sm text-slate-600">
                  {invoice.invoice_number} • {invoice.status} • Rp{" "}
                  {Number(invoice.amount).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/invoice/${invoice.public_id}`}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Open
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(invoice.public_id)}
                  disabled={deleteLoading}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}