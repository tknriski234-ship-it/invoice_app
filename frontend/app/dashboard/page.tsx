"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/config/env";
import { useInvoiceCreate } from "@/features/invoice/create/useInvoiceCreate";
import { useInvoiceDelete } from "@/features/invoice/delete/useInvoiceDelete";
import type { Invoice } from "@/features/invoice/types";

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
    handleCreateInvoice,
  } = useInvoiceCreate();
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
    handleDeleteInvoice,
  } = useInvoiceDelete();

  const loadInvoices = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Invoice[] | { detail?: string } | null =
        await res.json().catch(() => null);

      if (!res.ok) {
        const errorData = data as { detail?: string } | null;
        throw new Error(errorData?.detail || "Failed to load invoices");
      }

      setInvoices((data as Invoice[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleCreateInvoice(token, {
      title,
      issued_date: issuedDate,
      due_date: dueDate,
    });

    if (result) {
      setTitle("");
      setIssuedDate("");
      setDueDate("");
      await loadInvoices();
    }
  };

  const handleDelete = async (publicId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleDeleteInvoice(token, { publicId });

    if (result) {
      await loadInvoices();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/account/login");
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Create, open, and remove invoices.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void loadInvoices()}
            className="rounded-md border px-4 py-2"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border px-4 py-2"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Create invoice</h2>

        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            type="date"
            value={issuedDate}
            onChange={(event) => setIssuedDate(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <button
            type="submit"
            disabled={createLoading}
            className="rounded-md border px-4 py-2"
          >
            {createLoading ? "Creating..." : "Create invoice"}
          </button>
        </form>

        {createError && <p className="text-sm text-red-600">{createError}</p>}
        {createSuccess && (
          <p className="text-sm text-emerald-700">{createSuccess}</p>
        )}
      </section>

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
                    onClick={() => void handleDelete(invoice.public_id)}
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
    </main>
  );
}
