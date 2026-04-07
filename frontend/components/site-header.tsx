import Link from "next/link";
import type { ReactNode } from "react";

type SiteHeaderProps = {
  title?: ReactNode;
  secondary?: ReactNode;
  actions?: ReactNode;
  centeredTitle?: boolean;
};

export function SiteHeader({
  title,
  secondary,
  actions,
  centeredTitle = false,
}: SiteHeaderProps) {
  return (
    <header className="border-b border-[#C9D6DF] bg-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-4">
          {title && !centeredTitle ? (
            <div className="flex shrink-0 items-center text-lg font-semibold tracking-[-0.02em] text-[#1E2022]">
              {title}
            </div>
          ) : (
            <Link
              href="/"
              className="flex shrink-0 items-center text-lg font-semibold tracking-[-0.02em] text-[#1E2022]"
            >
              Invoice App
            </Link>
          )}

          {secondary ? (
            <div className="hidden min-w-0 items-center lg:flex">{secondary}</div>
          ) : null}
        </div>

        {title && centeredTitle ? (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-lg font-semibold tracking-[-0.02em] text-[#1E2022]">
            {title}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          {actions}
        </div>
      </div>
    </header>
  );
}
