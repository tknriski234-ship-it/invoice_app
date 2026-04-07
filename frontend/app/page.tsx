"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E2022]">
      <SiteHeader
        actions={
          <>
            <Link
              href="/login"
              className="rounded-full border border-[#C9D6DF] px-4 py-2 text-sm font-medium text-[#52616B] transition hover:border-[#1E2022] hover:text-[#1E2022]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#1E2022] px-4 py-2 text-sm font-medium text-[#F0F5F9] transition hover:bg-[#52616B]"
            >
              Register
            </Link>
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-12">
        <section className="relative py-12 sm:py-16">
          <div className="absolute right-8 top-0 h-44 w-44 rounded-full bg-[#C9D6DF]/35 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#F0F5F9] blur-3xl" />

          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#52616B]">
              Invoicing Workspace
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-[#1E2022] sm:text-6xl">
              Kelola invoice dengan tampilan yang tenang, rapi, dan terasa profesional.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#52616B] sm:text-lg">
              Buat akun, masuk ke dashboard, lalu atur invoice dan item dalam
              satu alur kerja yang sederhana. Semuanya dibuat supaya fokus tetap
              ada pada pekerjaan, bukan pada tampilan yang berisik.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-full bg-[#1E2022] px-6 py-3 text-sm font-medium text-[#F0F5F9] transition hover:bg-[#52616B]"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[#52616B] px-6 py-3 text-sm font-medium text-[#52616B] transition hover:border-[#1E2022] hover:bg-[#C9D6DF] hover:text-[#1E2022]"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm text-[#52616B]">
              <p>Clean dashboard</p>
              <span className="text-[#C9D6DF]">/</span>
              <p>Private workspace</p>
              <span className="text-[#C9D6DF]">/</span>
              <p>Invoice + items in one flow</p>
            </div>

            <div className="mt-14 grid gap-10 border-t border-[#C9D6DF] pt-8 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#52616B]">
                  Step 01
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1E2022]">Enter</p>
                <p className="mt-2 text-sm leading-6 text-[#52616B]">
                  Mulai dari halaman depan yang bersih dan langsung ke inti.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#52616B]">
                  Step 02
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1E2022]">Login</p>
                <p className="mt-2 text-sm leading-6 text-[#52616B]">
                  Masuk ke akun untuk membuka ruang kerja pribadimu.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#52616B]">
                  Step 03
                </p>
                <p className="mt-3 text-lg font-semibold text-[#1E2022]">
                  Manage
                </p>
                <p className="mt-2 text-sm leading-6 text-[#52616B]">
                  Atur invoice dan item dalam satu dashboard yang terhubung.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#C9D6DF] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-[#52616B]">
          &copy; 2026 Invoice App.
        </div>
      </footer>
    </div>
  );
}
