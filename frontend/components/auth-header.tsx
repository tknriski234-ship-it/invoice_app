import Link from "next/link";
import type { ReactNode } from "react";

type AuthHeaderProps = {
  actions?: ReactNode;
};

export function AuthHeader({ actions }: AuthHeaderProps) {
  return (
    <header className="border-b border-[#C9D6DF] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[-0.02em] text-[#1E2022]"
        >
          Invoice App
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {actions}
        </div>
      </div>
    </header>
  );
}
