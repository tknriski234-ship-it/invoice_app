"use client";

import { FormEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    public_id: string;
    full_name: string;
    email: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LoginResponse | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = new URLSearchParams({
        username: email,
        password,
      });

      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? "Login gagal");
        return;
      }

      localStorage.setItem("token", data.access_token);
      setResult(data);
    } catch {
      setError("Tidak bisa terhubung ke backend. Pastikan FastAPI sedang berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#d8f3ff,transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#edf7f1_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-sky-700">
            Invoice App
          </p>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-slate-950">
            Login endpoint tester for your FastAPI auth flow.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">
            Halaman ini mengirim email dan password ke endpoint
            <span className="font-medium text-slate-900"> /login </span>
            memakai format OAuth2 form, lalu menampilkan access token dan data
            user dari response backend.
          </p>

          <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50/80 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Request yang dikirim</p>
            <p className="mt-2">
              <span className="font-medium">POST</span> {API_BASE_URL}/login
            </p>
            <p className="mt-1">Content-Type: application/x-www-form-urlencoded</p>
            <p className="mt-1">Field: username=email, password=password</p>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-sky-400"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-sky-400"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              type="submit"
              disabled={loading}
            >
              {loading ? "Mencoba login..." : "Test Login"}
            </button>
          </form>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Login berhasil. Token juga sudah disimpan ke `localStorage`.
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-sm font-medium text-slate-200">Access token</p>
                <p className="mt-2 break-all font-mono text-xs leading-6 text-sky-300">
                  {result.access_token}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-sm font-medium text-slate-200">User payload</p>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-300">
                  {JSON.stringify(result.user, null, 2)}
                </pre>
              </div>

              <div><p className="text-sm text-slate-300">Token ini akan digunakan untuk mengakses endpoint yang memerlukan autentikasi.</p></div>
            </div>
          ) : null}
        </section>

        <section className="rounded-4xl border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
          <div><nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-slate-300 hover:text-white">Home</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white">Contact</a></li>
            </ul>
          </nav></div>
        </section>


      </div>
    </main>
  );
}
