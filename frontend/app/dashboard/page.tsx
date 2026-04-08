"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        router.push("/auth/login");
    }
    }, [router]);

    return (
    <main className="p-6">
        <h1 className="text-2xl font-bold">
        Dashboard
        </h1>

        <p className="text-gray-600">
        Selamat, lu berhasil login 😏
        </p>
    </main>
  );
}