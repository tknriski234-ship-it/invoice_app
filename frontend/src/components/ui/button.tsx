"use client";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
};

export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-medium transition";

  const style = {
    primary: "bg-slate-950 text-white hover:bg-slate-800",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "text-slate-600 hover:text-slate-900",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${style[variant]} ${className}`}
    >
      {children}
    </button>
  );
}