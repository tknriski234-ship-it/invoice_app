"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type DbStatus = "idle" | "loading" | "ok" | "failed";

type MeResponse = {
  full_name: string;
  email: string;
  is_active: boolean;
} | null;

export default function HomePage() {
  const [dbStatus, setDbStatus] = useState<DbStatus>("idle");
  const [dbMessage, setDbMessage] = useState("Belum cek koneksi backend.");
  const [currentUser, setCurrentUser] = useState<MeResponse>(null);
  const [meMessage, setMeMessage] = useState(
    "Belum ada data user. Login dulu untuk cek endpoint /user/me."
  );

  const checkBackend = async () => {
    setDbStatus("loading");
    setDbMessage("Mengecek koneksi backend...");

    try {
      const response = await fetch(`${API_BASE_URL}/get_db`);
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setDbStatus("ok");
        setDbMessage("Backend dan koneksi database terhubung.");
        return;
      }

      setDbStatus("failed");
      setDbMessage("Backend aktif, tapi koneksi database belum siap.");
    } catch {
      setDbStatus("failed");
      setDbMessage("Tidak bisa menjangkau backend. Pastikan FastAPI sedang jalan.");
    }
  };

  const checkCurrentUser = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setCurrentUser(null);
      setMeMessage("Token login belum ada di browser ini.");
      return;
    }

    setMeMessage("Mengambil profil user dari endpoint /user/me...");

    try {
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setCurrentUser(null);
        setMeMessage(data.detail ?? "Token tidak valid atau user tidak ditemukan.");
        return;
      }

      setCurrentUser(data);
      setMeMessage("Profil user berhasil diambil dari backend.");
    } catch {
      setCurrentUser(null);
      setMeMessage("Gagal terhubung ke endpoint /user/me.");
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await Promise.all([checkBackend(), checkCurrentUser()]);
    };

    void initializePage();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Invoice App</h1>
            <p className="text-sm text-slate-500">Simple backend project interface</p>
          </div>

          <nav className="ml-auto flex gap-6 text-sm text-slate-600">
            <Link href="/" className="transition hover:text-slate-950">
              Home
            </Link>
            <Link href="/login" className="transition hover:text-slate-950">
              Login
            </Link>
            <a
              href={`${API_BASE_URL}/docs`}
              className="transition hover:text-slate-950"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Backend Project
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Welcome to the invoice management app.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            This frontend is used to support the backend learning project.
            You can use it to explore authentication flow, test connected
            endpoints, and continue building the interface step by step.
          </p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">What is ready</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Login endpoint using FastAPI and JWT</li>
              <li>User authentication flow for protected routes</li>
              <li>Frontend workspace to continue UI development</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-950">Quick access</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Go to Login
              </Link>
              <a
                href={`${API_BASE_URL}/docs`}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                target="_blank"
                rel="noreferrer"
              >
                Open API Docs
              </a>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Backend status
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Terhubung ke endpoint <span className="font-medium">GET /get_db</span>
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  dbStatus === "ok"
                    ? "bg-emerald-100 text-emerald-700"
                    : dbStatus === "failed"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {dbStatus === "ok"
                  ? "Connected"
                  : dbStatus === "failed"
                    ? "Problem"
                    : dbStatus === "loading"
                      ? "Checking"
                      : "Idle"}
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">{dbMessage}</p>

            <button
              onClick={checkBackend}
              className="mt-6 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Check backend again
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Current user
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Menggunakan token browser ke endpoint
                  <span className="font-medium"> GET /user/me</span>
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Protected API
              </span>
            </div>

            {currentUser ? (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-base font-semibold text-slate-950">
                  {currentUser.full_name}
                </p>
                <p className="mt-1 text-sm text-slate-600">{currentUser.email}</p>
                <p className="mt-3 text-sm text-slate-600">
                  Status: {currentUser.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-slate-600">{meMessage}</p>
            )}

            {currentUser ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">{meMessage}</p>
            ) : null}

            <button
              onClick={checkCurrentUser}
              className="mt-6 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Check current user
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-slate-500">
          &copy; 2026 Invoice App. Built for backend learning and practice.
        </div>
      </footer>
    </div>
  );
}
