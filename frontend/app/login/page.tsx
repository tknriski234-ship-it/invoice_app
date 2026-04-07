"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthHeader } from "@/components/auth-header";

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
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      router.replace("/home");
      return;
    }

    setCheckingSession(false);
  }, [router]);

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

      router.push("/home");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke backend. Pastikan FastAPI sedang berjalan.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white text-[#1E2022]">
        <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6">
          <div className="text-sm text-[#52616B]">
            Memeriksa sesi login...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1E2022]">
      <AuthHeader
        actions={
          <Link
            href="/register"
            className="rounded-full border border-[#C9D6DF] px-4 py-2 text-sm font-medium text-[#52616B] transition hover:border-[#1E2022] hover:text-[#1E2022]"
          >
            Register
          </Link>
        }
      />

      <div className="mx-auto w-full max-w-3xl px-6 pt-6">
        <Link
          href="/"
          className="text-base font-medium text-[#52616B] transition hover:text-[#1E2022]"
        >
          {"<- Back"}
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 py-20">
        <section className="relative mx-auto w-full max-w-lg px-8 py-8">
          <span className="absolute bottom-0 left-0 top-0 w-px bg-[#C9D6DF]" />
          <span className="absolute bottom-0 right-0 top-0 w-px bg-[#C9D6DF]" />

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#52616B]">
            Login
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1E2022]">
            Masuk ke akunmu.
          </h2>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#52616B]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-b border-[#C9D6DF] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#52616B]"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#52616B]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-b border-[#C9D6DF] bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#52616B]"
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
              className="w-full rounded-full bg-[#1E2022] px-5 py-3 text-sm font-medium text-[#F0F5F9] transition hover:bg-[#52616B] disabled:cursor-not-allowed disabled:bg-[#C9D6DF] disabled:text-[#52616B]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#C9D6DF] pt-5 text-sm text-[#52616B]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-[#1E2022] transition hover:text-[#52616B]"
            >
              Buat akun dulu di sini.
            </Link>
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
