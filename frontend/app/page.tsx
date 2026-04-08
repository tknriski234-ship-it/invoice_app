"use client";

import { MainHeader } from "../components/layout/header";
import { PageFooter } from "../components/layout/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MainHeader />

      <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-24">
        <section className="max-w-2xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Invoice App
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Simple invoicing workspace for your product.
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Build invoices, manage items, and keep your workflow clean with a
            focused interface.
          </p>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
