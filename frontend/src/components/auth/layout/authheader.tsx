import Link from "next/link";

type AuthHeaderProps = {
  actionHref: string;
  actionLabel: string;
};

export default function AuthHeader({
  actionHref,
  actionLabel,
}: AuthHeaderProps) {
  return (
    <header className="w-full border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-8 py-3">
        <Link href="/" className="text-sm font-semibold text-slate-800">
          Invoice App
        </Link>

        <Link
          href={actionHref}
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </Link>
      </div>
    </header>
  );
}