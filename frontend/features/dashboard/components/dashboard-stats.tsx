type DashboardStatsProps = {
  invoiceCount: number | string;
  draftCount: number | string;
  paidCount: number | string;
};

// Tanggung jawab:
// - Menampilkan ringkasan angka dashboard
// - Fokus pada presentasi stats, bukan hitung datanya
export function DashboardStats({
  invoiceCount,
  draftCount,
  paidCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Invoices</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {invoiceCount}
        </p>
        <p className="text-sm text-slate-500">All invoices in this workspace.</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Drafts</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {draftCount}
        </p>
        <p className="text-sm text-slate-500">Invoices still in progress.</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Paid</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {paidCount}
        </p>
        <p className="text-sm text-slate-500">Completed and settled invoices.</p>
      </div>
    </div>
  );
}
