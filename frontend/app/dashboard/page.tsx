"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionTitle } from "../components/ui/section-title";
import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "../features/dashboard/components/dashboard-sidebar";
import { DashboardStats } from "../features/dashboard/components/dashboard-stats";
import { CreateInvoiceForm } from "../features/dashboard/components/create-invoice-form";
import { RecentInvoices } from "../features/dashboard/components/recent-invoices";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const {
    user,
    invoices,
    loading,
    error,
    createLoading,
    createError,
    handleLogout,
    handleRefresh,
    handleCreateInvoice,
    stats,
  } = useDashboard();
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleSidebarResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.min(Math.max(moveEvent.clientX - 24, 220), 360);
      setSidebarCollapsed(false);
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <main className="min-h-screen bg-[#f8f8f7] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <DashboardHeader
          workspaceLabel="Workspace / Invoices"
          title="Invoices"
          actions={
            <>
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Open sidebar
                </button>
              )}
              <Link
                href="/"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                Back to home
              </Link>
              <button
                onClick={() => void handleRefresh()}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          }
        />
      </section>

      <section className="px-4 py-4 lg:px-6">
        <div className="flex items-start gap-6">
          {!sidebarCollapsed && (
            <div
              className="relative shrink-0 overflow-hidden border-r border-slate-200 bg-[#fbfbfa]"
              style={{ width: sidebarWidth }}
            >
              <DashboardSidebar
                user={user}
                invoiceCount={loading ? 0 : stats.invoiceCount}
                draftCount={loading ? 0 : stats.draftCount}
                paidCount={loading ? 0 : stats.paidCount}
                collapsed={false}
                onToggle={() => setSidebarCollapsed(true)}
              />

              <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={handleSidebarResizeStart}
                className="absolute right-[-5px] top-0 h-full w-[10px] cursor-col-resize"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mx-auto max-w-4xl space-y-8">
              <div id="overview" className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <SectionTitle
                    eyebrow="Workspace"
                    title="Invoices"
                    description="Manage drafts, track paid invoices, and continue your work."
                  />

                  <div className="hidden items-center gap-2 border border-slate-200 px-3 py-2 text-sm text-slate-500 lg:flex">
                    <span className="text-slate-400">⌕</span>
                    <span>Search invoices...</span>
                  </div>
                </div>

                <DashboardStats
                  invoiceCount={loading ? "..." : stats.invoiceCount}
                  draftCount={loading ? "..." : stats.draftCount}
                  paidCount={loading ? "..." : stats.paidCount}
                />
              </div>

              <aside id="next-step" className="border-t border-slate-200 pt-6">
                <CreateInvoiceForm
                  loading={createLoading}
                  error={createError}
                  onSubmit={(payload) => void handleCreateInvoice(payload)}
                />
              </aside>

              <div id="recent-invoices" className="space-y-6">
                <RecentInvoices
                  invoices={invoices}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
