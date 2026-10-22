import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-accent-light to-accent text-white shadow-sm hover:shadow-md hover:from-accent hover:to-accent-hover disabled:from-accent/50 disabled:to-accent/50 disabled:shadow-none",
  secondary:
    "bg-white text-foreground border border-border hover:bg-gray-50 hover:border-accent/30 disabled:text-muted",
  ghost: "bg-transparent text-foreground hover:bg-gray-100 disabled:text-muted",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed active:scale-[0.97]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
