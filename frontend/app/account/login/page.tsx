"use client";

import { useState } from "react";
import { useLogin } from "@/app/features/auth/hooks/useLogin";

export default function LoginPage() {
  const { handleLogin, error, loading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="max-w-md mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={() => handleLogin({ email, password })}
        className="bg-black text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </main>
  );
}