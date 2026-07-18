"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "../ui/button";

export default function Header({ title }) {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-zinc-200 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Invoice workspace
          </p>
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link href={"/account/login"}>
            <Button>Login</Button>
          </Link>
          <Link href={"/account/register"}>
            <Button variant="secondary">Register</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
