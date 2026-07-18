"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext(null);

async function fetchCurrentUser() {
  try {
    return await apiFetch("/users/me");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const data = await fetchCurrentUser();

    setUser(data);
    setLoading(false);

    return data;
  }

  async function login(payload) {
    await apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return await refreshUser();
  }

  async function logout() {
    try {
      await apiFetch("/users/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const data = await fetchCurrentUser();

      if (!active) return;

      setUser(data);
      setLoading(false);
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }

  return context;
}