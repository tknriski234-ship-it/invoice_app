import { ReactNode } from "react";

type DashboardHeaderProps = {
  actions?: ReactNode;
  workspaceLabel?: string;
  title?: string;
};

// Tanggung jawab:
// - Header khusus area dashboard
// - Menampilkan judul halaman dan action utama
// - Dipakai hanya di feature dashboard
export function DashboardHeader({
  actions,
  workspaceLabel = "Workspace / Invoices",
  title = "Overview",
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {workspaceLabel}
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
