import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

const CONTENT_STATUS_LABELS: Record<string, { label: string; tone: Tone }> = {
  DRAFT: { label: "Entwurf", tone: "neutral" },
  IN_REVIEW: { label: "Zur Prüfung", tone: "warning" },
  APPROVED: { label: "Freigegeben", tone: "accent" },
  PUBLISHED: { label: "Veröffentlicht", tone: "success" },
};

export function ContentStatusBadge({ status }: { status: string }) {
  const entry = CONTENT_STATUS_LABELS[status] ?? { label: status, tone: "neutral" as Tone };
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
}

const USER_STATUS_LABELS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Ausstehend", tone: "warning" },
  APPROVED: { label: "Genehmigt", tone: "success" },
  REJECTED: { label: "Abgelehnt", tone: "danger" },
  SUSPENDED: { label: "Gesperrt", tone: "danger" },
};

export function UserStatusBadge({ status }: { status: string }) {
  const entry = USER_STATUS_LABELS[status] ?? { label: status, tone: "neutral" as Tone };
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
}
