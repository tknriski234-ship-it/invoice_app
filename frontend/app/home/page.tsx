"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { WorkspaceHeader } from "@/components/workspace-header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type DbStatus = "idle" | "loading" | "ok" | "failed";

type CurrentUser = {
  full_name: string;
  email: string;
  is_active: boolean;
} | null;

type Invoice = {
  id: number;
  public_id: string;
  invoice_number: string;
  title: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issued_date: string;
  due_date: string;
  created_at: string;
};

type CreateInvoicePayload = {
  title: string;
  issued_date: string;
  due_date: string;
};

const statusTone: Record<Invoice["status"], string> = {
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 320;
const SIDEBAR_DEFAULT_WIDTH = 240;
const SIDEBAR_COLLAPSE_THRESHOLD = 120;

type SidebarContentProps = {
  currentUser: CurrentUser;
  meMessage: string;
  invoiceCount: number;
  activeCount: number;
  paidCount: number;
  dbStatus: DbStatus;
  dbMessage: string;
  loadingInvoices: boolean;
  loadInvoices: () => void;
  handleLogout: () => void;
};

function SidebarContent({
  currentUser,
  meMessage,
  invoiceCount,
  activeCount,
  paidCount,
  dbStatus,
  dbMessage,
  loadingInvoices,
  loadInvoices,
  handleLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="border-b border-[#C9D6DF] pb-4">
        {currentUser ? (
          <div>
            <p className="truncate text-sm font-semibold text-[#1E2022]">
              {currentUser.full_name}
            </p>
            <p className="mt-1 truncate text-xs text-[#52616B]">
              {currentUser.email}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#52616B]">{meMessage}</p>
        )}
      </div>

      <div className="pt-4">
        <div className="rounded-xl border border-[#C9D6DF] bg-white px-3 py-2">
          <input
            readOnly
            value="Find..."
            className="w-full bg-transparent text-sm text-[#52616B] outline-none"
          />
        </div>
      </div>

      <nav className="mt-5 space-y-1 text-sm">
        <a
          href="#overview"
          className="block rounded-lg bg-[#E8EEF3] px-3 py-2 font-medium text-[#1E2022]"
        >
          Overview
        </a>
        <a
          href="#create-invoice"
          className="block rounded-lg px-3 py-2 text-[#52616B] transition hover:bg-white hover:text-[#1E2022]"
        >
          Create invoice
        </a>
        <a
          href="#invoice-list"
          className="block rounded-lg px-3 py-2 text-[#52616B] transition hover:bg-white hover:text-[#1E2022]"
        >
          Invoice list
        </a>
        <button
          onClick={loadInvoices}
          className="block w-full rounded-lg px-3 py-2 text-left text-[#52616B] transition hover:bg-white hover:text-[#1E2022]"
        >
          {loadingInvoices ? "Refreshing..." : "Refresh"}
        </button>
      </nav>

      <div className="mt-6 space-y-4 border-t border-[#C9D6DF] pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#52616B]">
            Invoices
          </p>
          <div className="mt-3 grid gap-3">
            <div>
              <p className="text-xl font-semibold text-[#1E2022]">{invoiceCount}</p>
              <p className="text-xs text-[#52616B]">Total invoices</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-[#1E2022]">{activeCount}</p>
              <p className="text-xs text-[#52616B]">Active invoices</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-[#1E2022]">{paidCount}</p>
              <p className="text-xs text-[#52616B]">Paid invoices</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#C9D6DF] pt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#52616B]">
            System
          </p>
          <p className="mt-2 text-sm font-medium text-[#1E2022]">
            {dbStatus === "ok"
              ? "Connected"
              : dbStatus === "failed"
                ? "Problem"
                : dbStatus === "loading"
                  ? "Checking"
                  : "Idle"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#52616B]">{dbMessage}</p>
        </div>
      </div>

      <div className="mt-auto border-t border-[#C9D6DF] pt-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-[#C9D6DF] px-3 py-2 text-sm font-medium text-[#52616B] transition hover:bg-white hover:text-[#1E2022]"
        >
          Logout
        </button>
        <p className="mt-4 text-xs text-[#52616B]">Invoice App 2026</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [dbStatus, setDbStatus] = useState<DbStatus>("idle");
  const [dbMessage, setDbMessage] = useState("Status sistem belum diperbarui.");
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [meMessage, setMeMessage] = useState(
    "Belum ada sesi yang aktif."
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceMessage, setInvoiceMessage] = useState(
    "Masuk dulu untuk melihat invoice."
  );
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [form, setForm] = useState<CreateInvoicePayload>({
    title: "",
    issued_date: "",
    due_date: "",
  });

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadInvoices = async () => {
    const token = getToken();

    if (!token) {
      setInvoices([]);
      setInvoiceMessage("Sesi tidak ditemukan. Silakan login dulu.");
      return;
    }

    setLoadingInvoices(true);
    setInvoiceMessage("Memuat daftar invoice...");

    try {
      const response = await fetch(`${API_BASE_URL}/invoice/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setInvoices([]);
        setInvoiceMessage(data.detail ?? "Invoice belum bisa dimuat.");
        return;
      }

      setInvoices(data);
      setInvoiceMessage(
        data.length > 0
          ? "Daftar invoice berhasil dimuat."
          : "Belum ada invoice. Mulai dari form pembuatan di samping."
      );
    } catch {
      setInvoices([]);
      setInvoiceMessage("Tidak bisa terhubung ke layanan invoice.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      setCreateError("Kamu perlu login sebelum membuat invoice.");
      return;
    }

    setCreatingInvoice(true);
    setCreateError("");
    setCreateSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/invoice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(data.detail ?? "Invoice belum berhasil dibuat.");
        return;
      }

      setCreateSuccess(`Invoice ${data.invoice_number} berhasil dibuat.`);
      setForm({
        title: "",
        issued_date: "",
        due_date: "",
      });
      await loadInvoices();
    } catch {
      setCreateError("Tidak bisa terhubung saat membuat invoice.");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const beginSidebarResize = () => {
    setIsResizingSidebar(true);
  };

  useEffect(() => {
    const initializePage = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      setDbStatus("loading");
      setDbMessage("Memeriksa status sistem...");

      try {
        const response = await fetch(`${API_BASE_URL}/get_db`);
        const data = await response.json();

        if (response.ok && data.status === "ok") {
          setDbStatus("ok");
          setDbMessage("Sistem dan database terhubung dengan baik.");
        } else {
          setDbStatus("failed");
          setDbMessage("Layanan aktif, tetapi database belum siap.");
        }
      } catch {
        setDbStatus("failed");
        setDbMessage("Layanan belum bisa dijangkau saat ini.");
      }

      setMeMessage("Memuat data akun...");
      setLoadingInvoices(true);
      setInvoiceMessage("Memuat daftar invoice...");

      try {
        const [userResponse, invoiceResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/invoice/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const userData = await userResponse.json();
        const invoiceData = await invoiceResponse.json();

        if (!userResponse.ok) {
          setCurrentUser(null);
          setMeMessage(
            userData.detail ?? "Akun tidak bisa dimuat."
          );
        } else {
          setCurrentUser(userData);
          setMeMessage("Data akun berhasil dimuat.");
        }

        if (!invoiceResponse.ok) {
          setInvoices([]);
          setInvoiceMessage(invoiceData.detail ?? "Invoice belum bisa dimuat.");
        } else {
          setInvoices(invoiceData);
          setInvoiceMessage(
            invoiceData.length > 0
              ? "Daftar invoice berhasil dimuat."
              : "Belum ada invoice. Mulai dari form pembuatan di samping."
          );
        }
      } catch {
        setCurrentUser(null);
        setInvoices([]);
        setMeMessage("Data akun belum bisa dimuat.");
        setInvoiceMessage("Invoice belum bisa dimuat.");
      } finally {
        setLoadingInvoices(false);
        setCheckingSession(false);
      }
    };

    void initializePage();
  }, [router]);

  useEffect(() => {
    if (!isResizingSidebar) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.clientX <= SIDEBAR_COLLAPSE_THRESHOLD) {
        setSidebarCollapsed(true);
        return;
      }

      const nextWidth = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, event.clientX)
      );

      setSidebarCollapsed(false);
      setSidebarWidth(nextWidth);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.clientX <= SIDEBAR_COLLAPSE_THRESHOLD) {
        setSidebarCollapsed(true);
      } else {
        const nextWidth = Math.min(
          SIDEBAR_MAX_WIDTH,
          Math.max(SIDEBAR_MIN_WIDTH, event.clientX)
        );

        setSidebarCollapsed(false);
        setSidebarWidth(nextWidth);
      }

      setIsResizingSidebar(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizingSidebar]);

  const invoiceCount = invoices.length;
  const paidCount = invoices.filter((invoice) => invoice.status === "paid").length;
  const activeCount = invoices.filter((invoice) => invoice.status !== "cancelled").length;

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <div className="text-sm text-slate-600">
            Memuat dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="min-h-screen lg:flex">
        <aside className="border-b border-[#C9D6DF] bg-[#F8FBFD] lg:hidden">
          <SidebarContent
            currentUser={currentUser}
            meMessage={meMessage}
            invoiceCount={invoiceCount}
            activeCount={activeCount}
            paidCount={paidCount}
            dbStatus={dbStatus}
            dbMessage={dbMessage}
            loadingInvoices={loadingInvoices}
            loadInvoices={loadInvoices}
            handleLogout={handleLogout}
          />
        </aside>

        <div
          className="hidden shrink-0 lg:flex"
          style={{ width: sidebarCollapsed ? 18 : sidebarWidth + 18 }}
        >
          <aside
            className="overflow-hidden border-r border-[#C9D6DF] bg-[#F8FBFD] transition-[width] duration-200"
            style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
          >
            <SidebarContent
              currentUser={currentUser}
              meMessage={meMessage}
              invoiceCount={invoiceCount}
              activeCount={activeCount}
              paidCount={paidCount}
              dbStatus={dbStatus}
              dbMessage={dbMessage}
              loadingInvoices={loadingInvoices}
              loadInvoices={loadInvoices}
              handleLogout={handleLogout}
            />
          </aside>

          <button
            type="button"
            aria-label="Resize sidebar"
            onPointerDown={beginSidebarResize}
            onDoubleClick={() => setSidebarCollapsed((prev) => !prev)}
            className="flex w-[18px] cursor-col-resize items-center justify-center border-r border-[#C9D6DF] bg-white active:bg-[#F0F5F9]"
          >
            <span className="h-12 w-[2px] rounded-full bg-[#C9D6DF]" />
          </button>
        </div>

        <main className="min-w-0 flex-1 bg-white">
          <div className="px-6 py-8">
            <div className="w-full">
              <WorkspaceHeader
                title="Invoices"
              />

              <div className="mx-auto mt-8 max-w-5xl">
                <div className="flex flex-col gap-3 border-b border-[#C9D6DF] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="border-b border-[#C9D6DF] px-0 py-3">
                    <input
                      readOnly
                      value="Search invoices..."
                      className="w-full bg-transparent text-sm text-[#52616B] outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-[#C9D6DF] px-3 py-2 text-sm text-[#52616B]">
                    {invoiceCount} items
                  </div>
                </div>
                </div>

                <div className="mt-8 space-y-8">
                  <section
                    id="overview"
                    className="grid gap-6 border-b border-[#C9D6DF] pb-6 md:grid-cols-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1E2022]">Total invoices</p>
                      <p className="mt-2 text-2xl font-semibold text-[#1E2022]">{invoiceCount}</p>
                      <p className="mt-1 text-sm text-[#52616B]">All invoices in this workspace.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E2022]">Active invoices</p>
                      <p className="mt-2 text-2xl font-semibold text-[#1E2022]">{activeCount}</p>
                      <p className="mt-1 text-sm text-[#52616B]">Invoices still in progress.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E2022]">Paid invoices</p>
                      <p className="mt-2 text-2xl font-semibold text-[#1E2022]">{paidCount}</p>
                      <p className="mt-1 text-sm text-[#52616B]">{dbMessage}</p>
                    </div>
                  </section>

                  <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <section id="create-invoice" className="border-b border-[#C9D6DF] pb-6">
                      <div className="flex flex-col gap-2 border-b border-[#C9D6DF] pb-4">
                        <h3 className="text-xl font-semibold text-[#1E2022]">
                          Create invoice
                        </h3>
                        <p className="text-sm text-[#52616B]">
                          Isi detail dasar invoice, lalu tambahkan item setelah invoice dibuat.
                        </p>
                      </div>

                      <form className="mt-6 space-y-5" onSubmit={handleCreateInvoice}>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#1E2022]">
                            Title
                          </label>
                          <input
                            value={form.title}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, title: event.target.value }))
                            }
                            className="w-full border-b border-[#C9D6DF] px-0 py-3 text-sm outline-none transition focus:border-[#52616B]"
                            placeholder="Invoice website redesign"
                            required
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-[#1E2022]">
                              Issued date
                            </label>
                            <input
                              type="date"
                              value={form.issued_date}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, issued_date: event.target.value }))
                              }
                              className="w-full border-b border-[#C9D6DF] px-0 py-3 text-sm outline-none transition focus:border-[#52616B]"
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-[#1E2022]">
                              Due date
                            </label>
                            <input
                              type="date"
                              value={form.due_date}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, due_date: event.target.value }))
                              }
                              className="w-full border-b border-[#C9D6DF] px-0 py-3 text-sm outline-none transition focus:border-[#52616B]"
                              required
                            />
                          </div>
                        </div>

                        {createError ? (
                          <div className="border-l-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {createError}
                          </div>
                        ) : null}

                        {createSuccess ? (
                          <div className="border-l-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {createSuccess}
                          </div>
                        ) : null}

                        <button
                          type="submit"
                          disabled={creatingInvoice || !currentUser}
                          className="bg-[#1E2022] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#52616B] disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {creatingInvoice ? "Creating..." : "Create invoice"}
                        </button>
                      </form>
                    </section>

                    <section id="invoice-list" className="pb-6">
                      <div className="flex flex-col gap-2 border-b border-[#C9D6DF] pb-4">
                        <h3 className="text-xl font-semibold text-[#1E2022]">Invoice list</h3>
                        <p className="text-sm text-[#52616B]">{invoiceMessage}</p>
                      </div>

                      <div className="mt-4 space-y-4">
                        {invoices.length === 0 ? (
                          <div className="py-4 text-sm text-[#52616B]">
                            Belum ada invoice yang bisa ditampilkan.
                          </div>
                        ) : (
                          invoices.map((invoice) => (
                            <div
                              key={invoice.public_id}
                              className="border-b border-[#C9D6DF] px-0 py-4"
                            >
                              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-[#52616B]">
                                    {invoice.invoice_number}
                                  </p>
                                  <h4 className="mt-2 text-lg font-semibold text-[#1E2022]">
                                    {invoice.title}
                                  </h4>
                                  <p className="mt-2 text-sm text-[#52616B]">
                                    Issued {invoice.issued_date} • Due {invoice.due_date}
                                  </p>
                                </div>

                                <div className="flex flex-col items-start gap-3 md:items-end">
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[invoice.status]}`}
                                  >
                                    {invoice.status}
                                  </span>
                                  <p className="text-lg font-semibold text-[#1E2022]">
                                    Rp {Number(invoice.amount).toLocaleString("id-ID")}
                                  </p>
                                  <Link
                                    href={`/invoice/${invoice.public_id}`}
                                    className="border-b border-[#C9D6DF] px-0 py-1 text-sm font-medium text-[#52616B] transition hover:border-[#52616B] hover:text-[#1E2022]"
                                  >
                                    View details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-slate-500">
          &copy; 2026 Invoice App.
        </div>
      </footer>
    </div>
  );
}
