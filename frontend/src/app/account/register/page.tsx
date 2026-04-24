"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputForm from "@/components/ui/Form";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { useRegister } from "@/features/auth/register/useRegister";
import RegisterHeader from "@/components/auth/layout/registerheader";
export default function RegisterPage() {
  const router = useRouter();
  const { loading, error, success, handleRegister } = useRegister();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // 🔥 redirect kalau success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push("/account/login");
      }, 1500);
    }
  }, [success, router]);

  function onSubmit() {
    setLocalError(null);

    if (!full_name || !email || !password || !confirm) {
      setLocalError("Semua field wajib diisi");
      return;
    }

    if (password !== confirm) {
      setLocalError("Password tidak sama");
      return;
    }

    handleRegister({
      full_name,
      email,
      password,
    });
  }

  return (
    <>
    <RegisterHeader/>
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col gap-5">
          
          {/* TITLE */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-slate-800">
              Create Account
            </h1>
            <p className="text-sm text-slate-500">
              Daftar untuk mulai menggunakan aplikasi
            </p>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-4">
            <InputForm
              placeholder="Nama"
              value={full_name}
              onChange={setFullName}
            />

            <InputForm
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            <InputForm
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />

            <InputForm
              type="password"
              placeholder="Konfirmasi Password"
              value={confirm}
              onChange={setConfirm}
            />
          </div>

          {/* BUTTON */}
          <Button
            disabled={loading}
            className="w-full"
            onClick={onSubmit}
          >
            {loading ? "Loading..." : "Register"}
          </Button>

          {/* ERROR LOCAL */}
          {localError && <Alert type="error" message={localError} />}

          {/* ERROR SERVER */}
          {error && <Alert type="error" message={error} />}

          {/* SUCCESS */}
          {success && <Alert type="success" message={success} />}

        </div>
      </main>

    </>
  );
}