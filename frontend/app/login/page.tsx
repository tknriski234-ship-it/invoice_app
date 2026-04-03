"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    full_name: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams({
        username: email,
        password,
      });

      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data: LoginResponse | { detail?: string } = await response.json();

      if (!response.ok) {
        setError(
          "detail" in data && data.detail
            ? data.detail
            : "Login gagal. Cek email dan password kamu."
        );
        return;
      }

      if ("access_token" in data) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke backend. Pastikan FastAPI sedang berjalan.");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="mx-auto flex max-w-5xl flex-1 items-center px-6 py-16">
        <div className="grid w-full gap-8 md:grid-cols-[1fr_420px]">
          <section className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Authentication
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Sign in to continue your backend project flow.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Halaman ini terhubung langsung ke endpoint
              <span className="font-medium"> POST /user/login</span> milik
              FastAPI. Setelah berhasil login, token akan disimpan di browser
              lalu kamu diarahkan kembali ke homepage untuk mengecek endpoint
              protected seperti <span className="font-medium">/user/me</span>.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">Flow sekarang</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Masukkan email dan password user yang sudah terdaftar.</li>
                <li>Frontend mengirim OAuth2 form ke endpoint login backend.</li>
                <li>Token disimpan ke localStorage untuk request berikutnya.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-950">Login</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Gunakan akun yang sudah kamu buat lewat endpoint register.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-500">
              Belum punya akun? Daftarkan dulu lewat backend atau Swagger docs.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
