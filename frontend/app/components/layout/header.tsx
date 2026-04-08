import Link from "next/link";

// Tanggung jawab:
// - Header utama landing page
// - Tempat brand, navigasi, atau action utama
// - Hanya fokus ke area atas halaman
export function MainHeader() {
    return (
    <header className="w-full border-b border-slate-200 bg-white text-slate-950">
        <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
            Invoice App
            </Link>

            <div className="flex items-center gap-3">
            <Link
                href="/account/login"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
                Login
            </Link>

            <Link
                href="/register"
                className="rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
                Register
            </Link>
            </div>
        </div>
        </div>
    </header>
    );
}
