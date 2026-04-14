"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "./service";
import { LoginSchema } from "./schema";

export function useLogin() {
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null > (null);

    async function handleLogin(input : unknown) {
        setLoading(true);
        setError(null);

        try {
            const parsed = LoginSchema.safeParse(input);

            if (!parsed.success) {
                setError(parsed.error.issues[0]?.message || "invalid input");
                return;
            }

            const result = await loginService(parsed.data);

            localStorage.setItem("token", result.access_token);
            router.push("/dashboard");
        }   catch (err:unknown) {
            setError((err as Error).message || "something went wrong");
        }   finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        handleLogin,
    };
}