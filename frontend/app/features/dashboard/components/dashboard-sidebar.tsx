import Link from "next/link";
import { DashboardUser } from "../schema/dashboard-schema";

type DashboardSidebarProps = {
  user: DashboardUser | null;
  invoiceCount: number;
  draftCount: number;
  paidCount: number;
  collapsed?: boolean;
  onToggle?: () => void;
};

// Tanggung jawab:
// - Sidebar khusus halaman dashboard
// - Menampilkan navigasi dasar dan ringkasan workspace
// - Fokus ke struktur kiri halaman, bukan logic data
export function DashboardSidebar({
  user,
  invoiceCount,
  draftCount,
  paidCount,
  collapsed = false,
  onToggle,
}: DashboardSidebarProps) {
  return (
    <aside className="flex min-h-[calc(100vh-2rem)] flex-col bg-[#fbfbfa] px-3 py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-slate-950 transition hover:text-slate-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E2022] text-xs font-semibold text-white">
            IA
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {user?.full_name ?? "Invoice App"}
              </p>
              <p className="truncate text-xs text-slate-500">Workspace</p>
            </div>
          )}
        </Link>

        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
          >
            {collapsed ? ">" : "<"}
          </button>
        ) : null}
      </div>

      {!collapsed && (
        <div className="mt-4 space-y-2 border-b border-slate-200 pb-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Profile
          </p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-950">
              {user?.full_name ?? "Your account"}
            </p>
            <p className="text-sm text-slate-500">
              {user?.email ?? "Loading profile..."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2 border-b border-slate-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <h2 className="text-base font-semibold text-slate-950">Invoices</h2>
        {!collapsed && (
          <p className="text-sm leading-6 text-slate-600">
            Keep your invoice workflow organized in one place.
          </p>
        )}
      </div>

      <nav className="mt-6 space-y-2">
        {!collapsed && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </p>
        )}
        <div className="space-y-1">
          <a
            href="#overview"
            className="block px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
          >
            {collapsed ? "Ov" : "Overview"}
          </a>
          <a
            href="#recent-invoices"
            className="block px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
          >
            {collapsed ? "Ri" : "Recent invoices"}
          </a>
          <a
            href="#next-step"
            className="block px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
          >
            {collapsed ? "Ns" : "Next step"}
          </a>
        </div>
      </nav>

      <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
        {!collapsed && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Summary
          </p>
        )}
        <div className="space-y-3">
          <div className="border-b border-slate-200 px-1 pb-3">
            {!collapsed && <p className="text-sm text-slate-500">Invoices</p>}
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {invoiceCount}
            </p>
          </div>
          <div className="border-b border-slate-200 px-1 pb-3">
            {!collapsed && <p className="text-sm text-slate-500">Drafts</p>}
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {draftCount}
            </p>
          </div>
          <div className="px-1 pb-3">
            {!collapsed && <p className="text-sm text-slate-500">Paid</p>}
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {paidCount}
            </p>
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Session
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Signed in as {user?.email ?? "your account"}.
          </p>
        </div>
      )}
    </aside>
  );
}
