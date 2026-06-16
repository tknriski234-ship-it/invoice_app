"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Button from "../UI/Button";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      variant="ghost"
      size="md"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="min-w-24"
      suppressHydrationWarning
    >
      {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
    </Button>
  );
}
