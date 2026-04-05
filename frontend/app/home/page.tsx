"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

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

export default function HomePage() {
  const router = useRouter();
  const [dbStatus, setDbStatus] = useState<DbStatus>("idle");
  const [dbMessage, setDbMessage] = useState("Belum cek koneksi backend.");
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [meMessage, setMeMessage] = useState(
    "Belum ada sesi login di browser ini."
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceMessage, setInvoiceMessage] = useState(
    "Login dulu untuk melihat invoice."
  );
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
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
      setInvoiceMessage("Token login belum ada. Login dulu untuk membuka invoice.");
      return;
    }

    setLoadingInvoices(true);
    setInvoiceMessage("Mengambil daftar invoice...");

    try {
      const response = await fetch(`${API_BASE_URL}/invoice/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setInvoices([]);
        setInvoiceMessage(data.detail ?? "Gagal mengambil invoice.");
        return;
      }

      setInvoices(data);
      setInvoiceMessage(
        data.length > 0
          ? "Invoice berhasil dimuat."
          : "Belum ada invoice. Buat invoice pertama kamu dari form di samping."
      );
    } catch {
      setInvoices([]);
      setInvoiceMessage("Tidak bisa terhubung ke endpoint invoice.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      setCreateError("Login dulu sebelum membuat invoice.");
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
        setCreateError(data.detail ?? "Gagal membuat invoice.");
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
      setCreateError("Tidak bisa terhubung ke backend saat membuat invoice.");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  useEffect(() => {
    const initializePage = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      setDbStatus("loading");
      setDbMessage("Mengecek koneksi backend...");

      try {
        const response = await fetch(`${API_BASE_URL}/get_db`);
        const data = await response.json();

        if (response.ok && data.status === "ok") {
          setDbStatus("ok");
          setDbMessage("Backend dan koneksi database terhubung.");
        } else {
          setDbStatus("failed");
          setDbMessage("Backend aktif, tapi koneksi database belum siap.");
        }
      } catch {
        setDbStatus("failed");
        setDbMessage("Tidak bisa menjangkau backend. Pastikan FastAPI sedang jalan.");
      }

      setMeMessage("Mengambil profil user...");
      setLoadingInvoices(true);
      setInvoiceMessage("Mengambil daftar invoice...");

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
            userData.detail ?? "Token tidak valid atau user tidak ditemukan."
          );
        } else {
          setCurrentUser(userData);
          setMeMessage("Profil user berhasil diambil.");
        }

        if (!invoiceResponse.ok) {
          setInvoices([]);
          setInvoiceMessage(invoiceData.detail ?? "Gagal mengambil invoice.");
        } else {
          setInvoices(invoiceData);
          setInvoiceMessage(
            invoiceData.length > 0
              ? "Invoice berhasil dimuat."
              : "Belum ada invoice. Buat invoice pertama kamu dari form di samping."
          );
        }
      } catch {
        setCurrentUser(null);
        setInvoices([]);
        setMeMessage("Gagal terhubung ke endpoint /user/me.");
        setInvoiceMessage("Tidak bisa terhubung ke endpoint invoice.");
      } finally {
        setLoadingInvoices(false);
        setCheckingSession(false);
      }
    };

    void initializePage();
  }, [router]);

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
      <SiteHeader
        actions={
          currentUser ? (
            <>
              <button
                onClick={loadInvoices}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                {loadingInvoices ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                Logout
              </button>
            </>
          ) : null
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Kelola invoice langsung dari frontend.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Halaman private ini terhubung ke API login, current user, create invoice,
              dan list invoice. Jadi flow produkmu sekarang lebih natural: landing dulu,
              login dulu, baru masuk dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm font-medium text-slate-500">Backend status</p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {dbStatus === "ok"
                    ? "Connected"
                    : dbStatus === "failed"
                      ? "Problem"
                      : dbStatus === "loading"
                        ? "Checking"
                        : "Idle"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{dbMessage}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm font-medium text-slate-500">Current user</p>
                {currentUser ? (
                  <>
                    <p className="mt-3 text-base font-semibold text-slate-950">
                      {currentUser.full_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{currentUser.email}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Status: {currentUser.is_active ? "Active" : "Inactive"}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{meMessage}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-l border-slate-200 pl-0 md:pl-8">
            <h3 className="text-2xl font-semibold text-slate-950">Create invoice</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              `amount` tidak diisi manual lagi. Total invoice dihitung otomatis dari invoice items.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleCreateInvoice}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                  placeholder="Invoice website redesign"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Issued date
                  </label>
                  <input
                    type="date"
                    value={form.issued_date}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, issued_date: event.target.value }))
                    }
                    className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, due_date: event.target.value }))
                    }
                    className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                    required
                  />
                </div>
              </div>

              {createError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {createError}
                </div>
              ) : null}

              {createSuccess ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {createSuccess}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={creatingInvoice || !currentUser}
                className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {creatingInvoice ? "Creating..." : "Create Invoice"}
              </button>
            </form>
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">My invoices</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{invoiceMessage}</p>
          </div>

          <div className="mt-6 space-y-4">
            {invoices.length === 0 ? (
              <div className="px-0 py-5 text-sm text-slate-600">
                Belum ada invoice yang bisa ditampilkan.
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.public_id}
                  className="border-t border-slate-200 py-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {invoice.invoice_number}
                      </p>
                      <h4 className="mt-2 text-xl font-semibold text-slate-950">
                        {invoice.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-600">
                        Issued {invoice.issued_date} • Due {invoice.due_date}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[invoice.status]}`}
                      >
                        {invoice.status}
                      </span>
                      <p className="text-lg font-semibold text-slate-950">
                        Rp {Number(invoice.amount).toLocaleString("id-ID")}
                      </p>
                      <Link
                        href={`/invoice/${invoice.public_id}`}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                      >
                        Open detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-slate-500">
          &copy; 2026 Invoice App. Private home after login, public main page before it.
        </div>
      </footer>
    </div>
  );
}
