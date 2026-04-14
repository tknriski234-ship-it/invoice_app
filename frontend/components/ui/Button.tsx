"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
    children : React.ReactNode;
    OnClick? : () => void;
    disabled? : boolean;
    variant? :ButtonVariant;
    className?: string;
};

export default function Button({children,OnClick,disabled,variant="primary",className="",}: ButtonProps){

    const base = "w-full rounded-xl py-3 text-sm font-medium transition";

    const styles = {
        primary : "bg-slate-950 text-white hover:bg-slate-800",
        secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
        danger: "bg-red-600 text-white hover:bg-red-500",
    }

    return (
        <button 
        onClick={OnClick}
        disabled={disabled}
        className={`${base} ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );

}