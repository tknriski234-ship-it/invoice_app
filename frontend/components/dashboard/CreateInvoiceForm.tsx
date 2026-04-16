"use client";

import { useState } from "react";

export default function CreateInvoiceForm({
  onSubmit,
  loading,
  error,
  success,
}: {
  onSubmit: (data: {
    title: string;
    issued_date: string;
    due_date: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
  success?: string | null;
}) {
  const [title, setTitle] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      title,
      issued_date: issuedDate,
      due_date: dueDate,
    });

    setTitle("");
    setIssuedDate("");
    setDueDate("");
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Create invoice</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />

        <input
          type="date"
          value={issuedDate}
          onChange={(e) => setIssuedDate(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border px-4 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-md border px-4 py-2"
        >
          {loading ? "Creating..." : "Create invoice"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}
    </section>
  );
}