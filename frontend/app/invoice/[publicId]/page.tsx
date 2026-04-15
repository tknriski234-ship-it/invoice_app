"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/config/env";
import { useInvoiceDelete } from "@/features/invoice/delete/useInvoiceDelete";
import { useInvoiceUpdate } from "@/features/invoice/update/useInvoiceUpdate";
import { useInvoiceItemAdd } from "@/features/invoice/item/add/useInvoiceItemAdd";
import { useInvoiceItemDelete } from "@/features/invoice/item/delete/useInvoiceItemDelete";
import { useUpdateItemInvoice } from "@/features/invoice/item/update/useUpdateItemInvoice";
import type { Invoice, InvoiceStatus } from "@/features/invoice/types";
import type { InvoiceItem } from "@/features/invoice/item/types";

type InvoiceDetailPageProps = {
  params: Promise<{
    publicId: string;
  }>;
};

type EditItemState = {
  itemPublicId: string;
  title: string;
  description: string;
  quantity: string;
  unit_price: string;
};

export default function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const router = useRouter();
  const { publicId } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("draft");
  const [editItem, setEditItem] = useState<EditItemState | null>(null);

  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    handleUpdateInvoice,
  } = useInvoiceUpdate();
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
    handleDeleteInvoice,
  } = useInvoiceDelete();
  const {
    loading: addLoading,
    error: addError,
    success: addSuccess,
    handleAddInvoiceItem,
  } = useInvoiceItemAdd();
  const {
    loading: deleteItemLoading,
    error: deleteItemError,
    success: deleteItemSuccess,
    handleDeleteInvoiceItem,
  } = useInvoiceItemDelete();
  const {
    loading: updateItemLoading,
    error: updateItemError,
    success: updateItemSuccess,
    handleUpdateInvoiceItem,
  } = useUpdateItemInvoice();

  const loadInvoiceDetail = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [invoiceRes, itemRes] = await Promise.all([
        fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/${publicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${env.NEXT_PUBLIC_API_URL}/invoices/${publicId}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const invoiceData: Invoice | { detail?: string } | null =
        await invoiceRes.json().catch(() => null);
      const itemData: InvoiceItem[] | { detail?: string } | null =
        await itemRes.json().catch(() => null);

      if (!invoiceRes.ok) {
        const err = invoiceData as { detail?: string } | null;
        throw new Error(err?.detail || "Failed to load invoice");
      }

      if (!itemRes.ok) {
        const err = itemData as { detail?: string } | null;
        throw new Error(err?.detail || "Failed to load invoice items");
      }

      const invoiceResult = invoiceData as Invoice;
      setInvoice(invoiceResult);
      setItems((itemData as InvoiceItem[]) ?? []);
      setInvoiceTitle(invoiceResult.title);
      setInvoiceDueDate(invoiceResult.due_date);
      setInvoiceStatus(invoiceResult.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [publicId, router]);

  useEffect(() => {
    void loadInvoiceDetail();
  }, [loadInvoiceDetail]);

  const handleInvoiceUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleUpdateInvoice(token, {
      publicId,
      title: invoiceTitle,
      due_date: invoiceDueDate,
      status: invoiceStatus,
    });

    if (result) {
      await loadInvoiceDetail();
    }
  };

  const handleInvoiceDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleDeleteInvoice(token, { publicId });
    if (result) {
      router.push("/dashboard");
    }
  };

  const handleItemAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleAddInvoiceItem(publicId, token, {
      title,
      description,
      quantity,
      unit_price: unitPrice,
    });

    if (result) {
      setTitle("");
      setDescription("");
      setQuantity("1");
      setUnitPrice("");
      await loadInvoiceDetail();
    }
  };

  const handleItemDelete = async (itemPublicId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleDeleteInvoiceItem(token, { itemPublicId });
    if (result) {
      await loadInvoiceDetail();
    }
  };

  const handleItemUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editItem) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/account/login");
      return;
    }

    const result = await handleUpdateInvoiceItem(token, {
      itemPublicId: editItem.itemPublicId,
      title: editItem.title,
      description: editItem.description,
      quantity: editItem.quantity,
      unit_price: editItem.unit_price,
    });

    if (result) {
      setEditItem(null);
      await loadInvoiceDetail();
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p>Loading invoice...</p>
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-red-600">{error || "Invoice not found"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <section className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm underline underline-offset-4">
            Back to dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold">{invoice.title}</h1>
          <p className="text-sm text-slate-600">
            {invoice.invoice_number} • {invoice.status} • Rp{" "}
            {Number(invoice.amount).toLocaleString("id-ID")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadInvoiceDetail()}
          className="rounded-md border px-4 py-2"
        >
          Refresh
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Update invoice</h2>
        <form onSubmit={handleInvoiceUpdate} className="space-y-3">
          <input
            value={invoiceTitle}
            onChange={(event) => setInvoiceTitle(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            type="date"
            value={invoiceDueDate}
            onChange={(event) => setInvoiceDueDate(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <select
            value={invoiceStatus}
            onChange={(event) =>
              setInvoiceStatus(event.target.value as InvoiceStatus)
            }
            className="w-full rounded-md border px-4 py-2"
          >
            <option value="draft">draft</option>
            <option value="sent">sent</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
            <option value="cancelled">cancelled</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updateLoading}
              className="rounded-md border px-4 py-2"
            >
              {updateLoading ? "Saving..." : "Update invoice"}
            </button>
            <button
              type="button"
              onClick={() => void handleInvoiceDelete()}
              disabled={deleteLoading}
              className="rounded-md border px-4 py-2"
            >
              {deleteLoading ? "Deleting..." : "Delete invoice"}
            </button>
          </div>
        </form>
        {updateError && <p className="text-sm text-red-600">{updateError}</p>}
        {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
        {updateSuccess && (
          <p className="text-sm text-emerald-700">{updateSuccess}</p>
        )}
        {deleteSuccess && (
          <p className="text-sm text-emerald-700">{deleteSuccess}</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add item</h2>
        <form onSubmit={handleItemAdd} className="space-y-3">
          <input
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <input
            type="number"
            placeholder="Unit price"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            className="w-full rounded-md border px-4 py-2"
          />
          <button
            type="submit"
            disabled={addLoading}
            className="rounded-md border px-4 py-2"
          >
            {addLoading ? "Adding..." : "Add item"}
          </button>
        </form>
        {addError && <p className="text-sm text-red-600">{addError}</p>}
        {addSuccess && <p className="text-sm text-emerald-700">{addSuccess}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Items</h2>
        {deleteItemError && (
          <p className="text-sm text-red-600">{deleteItemError}</p>
        )}
        {deleteItemSuccess && (
          <p className="text-sm text-emerald-700">{deleteItemSuccess}</p>
        )}
        {updateItemError && (
          <p className="text-sm text-red-600">{updateItemError}</p>
        )}
        {updateItemSuccess && (
          <p className="text-sm text-emerald-700">{updateItemSuccess}</p>
        )}

        {items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.public_id} className="rounded-md border p-4">
                {editItem?.itemPublicId === item.public_id ? (
                  <form onSubmit={handleItemUpdate} className="space-y-3">
                    <input
                      value={editItem.title}
                      onChange={(event) =>
                        setEditItem((current) =>
                          current
                            ? { ...current, title: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-md border px-4 py-2"
                    />
                    <input
                      value={editItem.description}
                      onChange={(event) =>
                        setEditItem((current) =>
                          current
                            ? { ...current, description: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-md border px-4 py-2"
                    />
                    <input
                      type="number"
                      value={editItem.quantity}
                      onChange={(event) =>
                        setEditItem((current) =>
                          current
                            ? { ...current, quantity: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-md border px-4 py-2"
                    />
                    <input
                      type="number"
                      value={editItem.unit_price}
                      onChange={(event) =>
                        setEditItem((current) =>
                          current
                            ? { ...current, unit_price: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-md border px-4 py-2"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={updateItemLoading}
                        className="rounded-md border px-4 py-2"
                      >
                        {updateItemLoading ? "Saving..." : "Save item"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditItem(null)}
                        className="rounded-md border px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-600">
                      {item.description || "-"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {item.quantity} x {item.unit_price} = {item.subtotal}
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditItem({
                            itemPublicId: item.public_id,
                            title: item.title,
                            description: item.description || "",
                            quantity: String(item.quantity),
                            unit_price: String(item.unit_price),
                          })
                        }
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleItemDelete(item.public_id)}
                        disabled={deleteItemLoading}
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
