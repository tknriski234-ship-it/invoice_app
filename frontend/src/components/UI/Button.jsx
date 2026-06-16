export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-zinc-950";

  const variants = {
    primary: `
      bg-zinc-900 text-white
      hover:bg-zinc-800
      focus:ring-zinc-400

      dark:bg-zinc-100
      dark:text-zinc-900
      dark:hover:bg-zinc-200
    `,

    secondary: `
      bg-zinc-100 text-zinc-900
      hover:bg-zinc-200
      focus:ring-zinc-300

      dark:bg-zinc-800
      dark:text-zinc-100
      dark:hover:bg-zinc-700
    `,

    outline: `
      border border-zinc-200
      bg-white text-zinc-900
      hover:bg-zinc-50
      focus:ring-zinc-300

      dark:border-zinc-700
      dark:bg-zinc-900
      dark:text-zinc-100
      dark:hover:bg-zinc-800
    `,

    ghost: `
      text-zinc-700
      hover:bg-zinc-100
      focus:ring-zinc-300

      dark:text-zinc-300
      dark:hover:bg-zinc-800
    `,
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 00-10-10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
