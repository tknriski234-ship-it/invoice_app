"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getInvoiceDetail } from "@/features/invoice/services/invoiceApi";

export default function InvoicePage() {
  const { public_id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function apiFetch() {
      try {
        const data = await getInvoiceDetail(public_id);
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (public_id) {
      apiFetch();
    }
  }, [public_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <pre>{JSON.stringify(invoice, null, 2)}</pre>;
}