"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type InvoiceDetail = {
  public_id: string;
  invoice_number: string;
  title: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issued_date: string;
  due_date: string;
};

type InvoiceItem = {
  public_id: string;
  title: string;
  description: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
};

type ItemForm = {
  title: string;
  description: string;
  quantity: string;
  unit_price: string;
};

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ publicId: string }>();
  const publicId = params.publicId;

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Memuat detail invoice...");
  const [itemError, setItemError] = useState("");
  const [creatingItem, setCreatingItem] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [itemForm, setItemForm] = useState<ItemForm>({
    title: "",
    description: "",
    quantity: "1",
    unit_price: "",
  });

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadDetail = async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      setMessage("Token login tidak ditemukan. Silakan login dulu.");
      return;
    }

    setLoading(true);
    setMessage("Memuat detail invoice...");

    try {
      const [invoiceResponse, itemsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/invoice/${publicId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/invoice/${publicId}/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const invoiceData = await invoiceResponse.json();
      const itemsData = await itemsResponse.json();

      if (!invoiceResponse.ok) {
        setInvoice(null);
        setItems([]);
        setMessage(invoiceData.detail ?? "Gagal mengambil detail invoice.");
        return;
      }

      if (!itemsResponse.ok) {
        setInvoice(invoiceData);
        setItems([]);
        setMessage(itemsData.detail ?? "Detail invoice berhasil, tapi item gagal dimuat.");
        return;
      }

      setInvoice(invoiceData);
      setItems(itemsData);
      setMessage(
        itemsData.length > 0
          ? "Detail invoice berhasil dimuat."
          : "Invoice berhasil dimuat. Belum ada item."
      );
    } catch {
      setInvoice(null);
      setItems([]);
      setMessage("Tidak bisa terhubung ke backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) {
      setItemError("Login dulu sebelum menambah item.");
      return;
    }

    setCreatingItem(true);
    setItemError("");

    try {
      const response = await fetch(`${API_BASE_URL}/invoice/${publicId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: itemForm.title,
          description: itemForm.description || null,
          quantity: Number(itemForm.quantity),
          unit_price: Number(itemForm.unit_price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setItemError(data.detail ?? "Gagal menambah invoice item.");
        return;
      }

      setItemForm({
        title: "",
        description: "",
        quantity: "1",
        unit_price: "",
      });
      await loadDetail();
    } catch {
      setItemError("Tidak bisa terhubung ke backend saat menambah item.");
    } finally {
      setCreatingItem(false);
    }
  };

  useEffect(() => {
    const initializeDetail = async () => {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      setLoading(true);
      setMessage("Memuat detail invoice...");

      try {
        const [invoiceResponse, itemsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/invoice/${publicId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/invoice/${publicId}/items`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const invoiceData = await invoiceResponse.json();
        const itemsData = await itemsResponse.json();

        if (!invoiceResponse.ok) {
          setInvoice(null);
          setItems([]);
          setMessage(invoiceData.detail ?? "Gagal mengambil detail invoice.");
          return;
        }

        if (!itemsResponse.ok) {
          setInvoice(invoiceData);
          setItems([]);
          setMessage(itemsData.detail ?? "Detail invoice berhasil, tapi item gagal dimuat.");
          return;
        }

        setInvoice(invoiceData);
        setItems(itemsData);
        setMessage(
          itemsData.length > 0
            ? "Detail invoice berhasil dimuat."
            : "Invoice berhasil dimuat. Belum ada item."
        );
      } catch {
        setInvoice(null);
        setItems([]);
        setMessage("Tidak bisa terhubung ke backend.");
      } finally {
        setLoading(false);
        setCheckingSession(false);
      }
    };

    void initializeDetail();
  }, [publicId, router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <div className="text-sm text-slate-600">
            Memuat detail invoice...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader
        actions={
          <button
            onClick={() => router.back()}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            Back
          </button>
        }
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="text-sm text-slate-600">
            {message}
          </div>
        ) : invoice ? (
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {invoice.invoice_number}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                  {invoice.title}
                </h2>
                <p className="mt-4 text-base font-semibold text-slate-950">
                  Rp {Number(invoice.amount).toLocaleString("id-ID")}
                </p>
                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Issued date: {invoice.issued_date}</p>
                  <p>Due date: {invoice.due_date}</p>
                  <p>Status: {invoice.status}</p>
                  <p>Public ID: {invoice.public_id}</p>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">{message}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xl font-semibold text-slate-950">Add item</h3>
                <form className="mt-6 space-y-4" onSubmit={handleCreateItem}>
                  <input
                    value={itemForm.title}
                    onChange={(event) =>
                      setItemForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                    placeholder="Item title"
                    required
                  />
                  <textarea
                    value={itemForm.description}
                    onChange={(event) =>
                      setItemForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    className="min-h-28 w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                    placeholder="Description (optional)"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="number"
                      min="1"
                      value={itemForm.quantity}
                      onChange={(event) =>
                        setItemForm((prev) => ({
                          ...prev,
                          quantity: event.target.value,
                        }))
                      }
                      className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                      placeholder="Quantity"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={itemForm.unit_price}
                      onChange={(event) =>
                        setItemForm((prev) => ({
                          ...prev,
                          unit_price: event.target.value,
                        }))
                      }
                      className="w-full border-b border-slate-300 px-0 py-3 text-sm outline-none transition focus:border-slate-950"
                      placeholder="Unit price"
                      required
                    />
                  </div>

                  {itemError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {itemError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={creatingItem}
                    className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {creatingItem ? "Adding item..." : "Add Item"}
                  </button>
                </form>
              </div>
            </section>

            <section className="border-l border-slate-200 pl-0 md:pl-8">
              <h3 className="text-2xl font-semibold text-slate-950">Invoice items</h3>
              <div className="mt-6 space-y-4">
                {items.length === 0 ? (
                  <div className="px-0 py-5 text-sm text-slate-600">
                    Belum ada item untuk invoice ini.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.public_id}
                      className="border-t border-slate-200 py-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-950">
                            {item.title}
                          </p>
                          {item.description ? (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-sm text-slate-600 md:text-right">
                          <p>Qty: {item.quantity}</p>
                          <p>Unit: Rp {Number(item.unit_price).toLocaleString("id-ID")}</p>
                          <p className="mt-1 font-semibold text-slate-950">
                            Subtotal: Rp {Number(item.subtotal).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
