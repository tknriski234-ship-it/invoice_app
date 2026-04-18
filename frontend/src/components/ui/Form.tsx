"use client";

type InputProps = {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function InputForm({
  type = "text",
  placeholder,
  value,
  onChange,
  className = ""
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950 ${className}`}
    />
  );
}