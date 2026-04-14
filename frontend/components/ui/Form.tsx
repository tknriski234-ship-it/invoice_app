"use client";

type InputProps = {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value : string) => void;
};

export default function InputForm ({
    type="text",
    placeholder,
    value,onChange
}: InputProps) {

    return(
        <input 
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
        />
    );
}