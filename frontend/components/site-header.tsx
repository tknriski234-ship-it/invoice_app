import Link from "next/link";
import type { ReactNode } from "react";

type SiteHeaderProps = {
  actions?: ReactNode;
};

export function SiteHeader({ actions }: SiteHeaderProps) {
  return (
    <header className="border-b border-[#C9D6DF] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-6 py-4 sm:flex-row sm:items-center">
        <Link href="/" className="text-lg font-semibold text-[#1E2022]">
          Invoice App
        </Link>

        <div className="ml-auto flex flex-wrap items-center gap-3">{actions}</div>
      </div>
    </header>
  );
}
