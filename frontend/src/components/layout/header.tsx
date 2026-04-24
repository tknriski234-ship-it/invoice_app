"use client";

import Link from "next/link";
import Button from "../ui/button";

export default function HomeHeader() {
  return (
    <header className="w-full border-full border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link href="/" className="text-sm font-semibold text-slate-800">
          Invoice App
        </Link>

        {/* ACTION */}
        <div className="flex items-center gap-2">
          <Link href="/account/login">
            <Button variant="ghost" className="px-4 py-2">
              Login
            </Button>
          </Link>

          <Link href="/account/register">
            <Button variant="primary" className="px-4 py-2">
              Register
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}