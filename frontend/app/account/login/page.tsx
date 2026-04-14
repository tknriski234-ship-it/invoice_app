"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/login/useLogin";

export default function LoginPage() {
  const { loading, error, handleLogin } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main style={{ padding: 24, maxWidth: 400 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button
        onClick={() =>
          handleLogin({
            email,
            password,
          })
        }
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </main>
  );
}
