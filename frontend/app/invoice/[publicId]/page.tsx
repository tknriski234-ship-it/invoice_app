"use client";

import { use, useCallback, useEffect, useState } from "react";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { getInvoiceDetail } from "@/features/invoice/service/invoice";
import { Invoice } from "@/features/invoice/type";
import {
  createInvoiceItem,
  getInvoiceItems,
} from "@/features/invoice-items/service/invoice-item";
import {
  InvoiceItem,
  InvoiceItemCreatePayload,
} from "@/features/invoice-items/type";

type InvoiceDetailPageProps = {
  params: Promise<{
    publicId: string;
  }>;
};

export default function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { publicId } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");

  const loadInvoiceData = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError("");

      const [invoiceData, itemData] = await Promise.all([
        getInvoiceDetail(token, publicId),
        getInvoiceItems(token, publicId),
      ]);

      setInvoice(invoiceData);
      setItems(itemData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load invoice detail");
      }
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    void loadInvoiceData(token);
  }, [loadInvoiceData]);

  const handleCreateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setCreateError("Token not found");
      return;
    }

    const payload: InvoiceItemCreatePayload = {
      title,
      description: description || null,
      quantity: Number(quantity),
      unit_price: Number(unitPrice),
    };

    try {
      setCreateLoading(true);
      setCreateError("");

      await createInvoiceItem(token, publicId, payload);
      setTitle("");
      setDescription("");
      setQuantity("1");
      setUnitPrice("");
      await loadInvoiceData(token);
    } catch (err) {
      if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError("Failed to create invoice item");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main>
        <p>Invoice not found</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{invoice.title}</h1>
      <p>{invoice.invoice_number}</p>
      <p>{invoice.status}</p>
      <p>{invoice.amount}</p>

      <section>
        <h2>Add item</h2>

        {createError && <p>{createError}</p>}

        <form onSubmit={handleCreateItem}>
          <input
            type="text"
            placeholder="Item title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <input
            type="number"
            placeholder="Unit price"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
          />

          <button type="submit" disabled={createLoading}>
            {createLoading ? "Adding..." : "Add item"}
          </button>
        </form>
      </section>

      <section>
        <h2>Items</h2>

        {items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.public_id}>
                <p>{item.title}</p>
                <p>
                  {item.quantity} x {item.unit_price}
                </p>
                <p>{item.subtotal}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
