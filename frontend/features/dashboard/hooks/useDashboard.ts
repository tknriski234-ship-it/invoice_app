"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createInvoice,
  getCurrentUser,
  getMyInvoices,
} from "../service/dashboard";
import { DashboardState } from "../types";
import { InvoiceCreatePayload } from "../../invoice/type";

const initialState: DashboardState = {
  user: null,
  invoices: [],
  loading: true,
  error: "",
  createLoading: false,
  createError: "",
};

export function useDashboard() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>(initialState);

  const loadDashboard = async (token: string) => {
    try {
      setState((currentState) => ({
        ...currentState,
        loading: true,
        error: "",
      }));

      const [user, invoices] = await Promise.all([
        getCurrentUser(token),
        getMyInvoices(token),
      ]);

      setState((currentState) => ({
        ...currentState,
        user,
        invoices,
        loading: false,
        error: "",
      }));
    } catch (fetchError: unknown) {
      setState((currentState) => ({
        ...currentState,
        user: null,
        invoices: [],
        loading: false,
        error:
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading invoices",
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    void loadDashboard(token);
  }, [router]);

  const handleRefresh = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    await loadDashboard(token);
  };

  const handleCreateInvoice = async (payload: InvoiceCreatePayload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/account/login");
      return;
    }

    try {
      setState((currentState) => ({
        ...currentState,
        createLoading: true,
        createError: "",
      }));

      await createInvoice(token, payload);
      await loadDashboard(token);

      setState((currentState) => ({
        ...currentState,
        createLoading: false,
        createError: "",
      }));
    } catch (createError: unknown) {
      setState((currentState) => ({
        ...currentState,
        createLoading: false,
        createError:
          createError instanceof Error
            ? createError.message
            : "Something went wrong while creating invoice",
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/account/login");
  };

  const stats = useMemo(() => {
    const invoiceCount = state.invoices.length;
    const draftCount = state.invoices.filter(
      (invoice) => invoice.status === "draft",
    ).length;
    const paidCount = state.invoices.filter(
      (invoice) => invoice.status === "paid",
    ).length;

    return {
      invoiceCount,
      draftCount,
      paidCount,
    };
  }, [state.invoices]);

  return {
    user: state.user,
    invoices: state.invoices,
    loading: state.loading,
    error: state.error,
    createLoading: state.createLoading,
    createError: state.createError,
    handleLogout,
    handleRefresh,
    handleCreateInvoice,
    stats,
  };
}
