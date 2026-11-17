"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the main-site header/footer on campaign landing pages (/lp/…), which have their own chrome. */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  if (/^\/lp(\/|$)/.test(pathname)) return null;
  return <>{children}</>;
}
