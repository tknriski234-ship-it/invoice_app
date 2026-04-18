"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { useLogin } from "@/features/auth/login/useLogin";
import InputForm from "@/components/ui/Form";
import Alert from "@/components/ui/alert";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const { error, loading, handleLogin } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* 🔥 HEADER TARUH DI SINI NANTI */}
      {/* <Header /> */}

      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col gap-5">
          
          {/* TITLE */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500">
              Masuk ke akun kamu
            </p>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-4">
            <InputForm
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            <div className="relative w-full">
              <InputForm
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">
                Lupa password?
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            disabled={loading}
            variant="primary"
            className="w-full"
            onClick={() => {
              if (!email || !password) {
                alert("isi email atau password dahulu");
                return;
              }
              handleLogin({ email, password });
            }}
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          {/* ALERT */}
          {error && <Alert type="error" message={error} />}

          {/* FOOTER */}
          <p className="text-center text-xs text-slate-400">
            Belum punya akun?{" "}
            <span className="text-slate-700 font-medium cursor-pointer hover:underline">
              Daftar
            </span>
          </p>

        </div>
      </main>
    </>
  );
}