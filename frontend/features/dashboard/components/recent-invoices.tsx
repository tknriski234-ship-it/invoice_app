import { Invoice } from "../../invoice/type";

type RecentInvoicesProps = {
  invoices: Invoice[];
  loading: boolean;
  error: string;
};

// Tanggung jawab:
// - Menampilkan preview invoice terbaru
// - Menangani loading, error, empty state, dan list state
export function RecentInvoices({
  invoices,
  loading,
  error,
}: RecentInvoicesProps) {
  return (
    <div className="border-t border-slate-200 pt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">
          Recent invoices
        </h2>
        <p className="text-sm text-slate-600">
          A quick look at the invoices in your account.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading invoices...</p>}

      {!loading && error && (
        <p className="border-l-2 border-red-300 pl-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && invoices.length === 0 && (
        <p className="text-sm text-slate-500">
          No invoices yet. Your first invoice will appear here.
        </p>
      )}

      {!loading && !error && invoices.length > 0 && (
        <div className="space-y-3">
          {invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.public_id}
              className="flex items-center justify-between border-b border-slate-200 py-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-950">
                  {invoice.title}
                </p>
                <p className="text-sm text-slate-500">
                  {invoice.invoice_number}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium capitalize text-slate-950">
                  {invoice.status}
                </p>
                <p className="text-sm text-slate-500">
                  Rp {Number(invoice.amount).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
