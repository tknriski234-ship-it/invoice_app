import type { ReactNode } from "react";

type WorkspaceHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  actions,
}: WorkspaceHeaderProps) {
  return (
    <div className="border-b border-[#C9D6DF] pb-5">
      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-sm text-[#52616B]">{eyebrow}</p>
          ) : null}
          <h1 className="mt-1 text-xl font-semibold text-[#1E2022]">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-[#52616B]">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="sm:absolute sm:right-0 sm:top-0">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
