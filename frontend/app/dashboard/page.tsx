"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/config/env";
import { useInvoiceCreate } from "@/features/invoice/create/useInvoiceCreate";
import { useInvoiceDelete } from "@/features/invoice/delete/useInvoiceDelete";
import type { Invoice } from "@/features/invoice/types";

import CreateInvoiceForm from "@/components/dashboard/CreateInvoiceForm";
import InvoiceList from "@/components/dashboard/InvoiceList";

export default function DashboardPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to load invoices");
      }

      setInvoices(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  const handleCreate = async (data: {
    title: string;
    issued_date: string;
    due_date: string;
  }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleCreateInvoice(token, data);

    if (result) {
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
          <button onClick={() => void loadInvoices()}>
            Refresh
          </button>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      <CreateInvoiceForm
        onSubmit={handleCreate}
        loading={createLoading}
        error={createError}
        success={createSuccess}
      />

      <InvoiceList
        invoices={invoices}
        loading={loading}
        error={error}
        deleteError={deleteError}
        deleteSuccess={deleteSuccess}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </main>
  );
}