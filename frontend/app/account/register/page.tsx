"use client";

import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function RegisterPage() {
  const { error, success, loading, handleRegister } = useRegister();
  const [fullName, setFullName] = useState("");
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
            Register
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Create an account to start building invoices.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
          />
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
          onClick={() =>
            handleRegister({
              full_name: fullName,
              email,
              password,
            })
          }
          className="w-full rounded-xl bg-slate-950 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="font-medium text-slate-950 underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
