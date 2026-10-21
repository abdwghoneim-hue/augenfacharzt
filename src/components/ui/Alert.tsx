import { cn } from "@/lib/cn";

type Tone = "danger" | "success" | "warning" | "accent";

const toneClasses: Record<Tone, string> = {
  danger: "bg-danger-soft text-danger border-danger/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  accent: "bg-accent-soft text-accent border-accent/20",
};

export function Alert({
  tone = "accent",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3 text-sm", toneClasses[tone], className)}
      {...props}
    />
  );
}
