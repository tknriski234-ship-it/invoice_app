"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/register/useRegister";

export default function RegisterPage() {
  const { loading, error, success, handleRegister } = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main style={{ padding: 24, maxWidth: 400 }}>
      <h1>Register Tester</h1>

      {/* INPUTS */}
      <input
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <br />

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

      <br /><br />

      {/* BUTTON */}
      <button
        onClick={() =>
          handleRegister({
            full_name: fullName,
            email,
            password,
          })
        }
        disabled={loading}
      >
        {loading ? "Loading..." : "Register"}
      </button>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* SUCCESS */}
      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}
    </main>
  );
}