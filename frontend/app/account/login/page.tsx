"use client";

import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
  const { handleLogin, error, loading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Account
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Login
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Continue to your invoicing workspace.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
          />
        </div>

        <button
          onClick={() => handleLogin({ email, password })}
          className="w-full rounded-xl bg-slate-950 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/register"
            className="font-medium text-slate-950 underline underline-offset-4"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
