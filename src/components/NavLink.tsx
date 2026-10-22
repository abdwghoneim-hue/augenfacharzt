"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavLink({
  href,
  children,
  tone = "default",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "default" | "admin";
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative py-1 transition-colors duration-150",
        tone === "admin" ? "text-accent/80 hover:text-accent" : "text-foreground/80 hover:text-accent",
        isActive && "text-accent",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ease-out",
          isActive ? "w-full" : "w-0",
        )}
      />
    </Link>
  );
}
