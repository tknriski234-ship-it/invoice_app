"use client";

import { MainHeader } from "./components/layout/header";
import { PageFooter } from "./components/layout/footer";

// Tanggung jawab:
// - Entry page untuk landing page "/"
// - Menyusun header, main content, dan footer
// - Tidak menyimpan logic besar; fokus sebagai composition root
export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MainHeader />
      <PageFooter />
    </div>
  );
}
