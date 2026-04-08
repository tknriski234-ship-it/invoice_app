"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../service/login";
import { LoginRequest } from "../schema/login-schema";

export function useLogin() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (data: LoginRequest) => {
    setLoading(true);
    try {
        const res = await loginUser(data);
        localStorage.setItem("token", res.access_token);
        router.push("/dashboard");
    } catch (e : unknown) {
        if (e instanceof Error) {
        setError(e.message);
        } else {
        setError("An unknown error occurred");
        }
    } finally {
        setLoading(false);
    }
    };

    return { handleLogin, error, loading };
}