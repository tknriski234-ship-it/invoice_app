"use client";

import Link from "next/link";
import Button  from "@/components/ui/Button"

export default function HomeHeader() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b">
      
      {/* Logo */}
      <Link href="/" className="text-lg font-bold">
        InvoiceApp
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link href="#features">Features</Link>
        <Link href="#pricing">Pricing</Link>
      </nav>

      {/* Action */}
      <div className="flex items-center gap-2">
        <Link href="/account/login">
          <Button variant="secondary">Login</Button>
        </Link>

        <Link href="/account/register">
          <Button>Get Started</Button>
        </Link>
      </div>

    </header>
  );
}