"use client";

import { useState } from "react";

type CreateInvoiceFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (payload: {
    title: string;
    issued_date: string;
    due_date: string;
  }) => void;
};

export function CreateInvoiceForm({
  loading,
  error,
  onSubmit,
}: CreateInvoiceFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [issuedDate, setIssuedDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      title,
      issued_date: issuedDate,
      due_date: dueDate,
    });
  };

  return (
    <section className="border-t border-slate-200 pt-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Create invoice
        </p>
        <h2 className="text-xl font-semibold text-slate-950">
          Start a new invoice
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Add a title and dates first. Items can be added next.
        </p>
      </div>

      {error && (
        <p className="mt-4 border-l-2 border-red-300 pl-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Invoice title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-slate-950"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            value={issuedDate}
            onChange={(event) => setIssuedDate(event.target.value)}
            className="w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-slate-950"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-slate-950"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Creating..." : "Create invoice"}
        </button>
      </form>
    </section>
  );
}
