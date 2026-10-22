import Link from "next/link";
import { BookOpen, ClipboardList, TrendingUp, RotateCcw, Image as ImageIcon, RefreshCw } from "lucide-react";
import { requireApprovedUser } from "@/lib/guards";
import { getHomeStats, getSpecialtyOverview, getRecentActivity } from "@/lib/stats";
import { getSpecialtyIcon } from "@/lib/specialtyIcons";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const CONFIDENCE_LABELS: Record<string, { label: string; tone: "success" | "warning" | "danger" }> = {
  SICHER: { label: "Sicher", tone: "success" },
  TEILWEISE: { label: "Teilweise sicher", tone: "warning" },
  NICHT_GEWUSST: { label: "Nicht gewusst", tone: "danger" },
};

export default async function HomePage() {
  const user = await requireApprovedUser();
  const [stats, specialties, recent] = await Promise.all([
    getHomeStats(user.id),
    getSpecialtyOverview(user.id),
    getRecentActivity(user.id),
  ]);
  const overallPercent =
    stats.totalPublished > 0 ? Math.round((stats.reviewed / stats.totalPublished) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-accent to-accent-light px-6 py-8 text-white shadow-sm sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-secondary/30 blur-2xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Willkommen, {user.username}</h1>
            <p className="mt-1 max-w-xl text-sm text-white/80">
              Mündliche Facharztprüfung Augenheilkunde — {stats.reviewed} von {stats.totalPublished}{" "}
              Fragen bearbeitet ({overallPercent}% Lernfortschritt).
            </p>
          </div>
          <Link href="/lernen">
            <Button
              type="button"
              className="bg-none! bg-white text-accent shadow-md hover:bg-white/90"
            >
              <BookOpen className="h-4 w-4" />
              Lernen fortsetzen
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Gesamtfragen"
          value={stats.totalPublished}
          tone="accent"
          delay={0}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Bearbeitete Fragen"
          value={stats.reviewed}
          tone="secondary"
          delay={60}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Lernfortschritt"
          value={`${overallPercent}%`}
          tone="success"
          delay={120}
        />
        <StatCard
          icon={<RotateCcw className="h-5 w-5" />}
          label="Zur Wiederholung"
          value={stats.dueCount}
          tone="warning"
          delay={180}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Schnellzugriff
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction href="/lernen" icon={<BookOpen className="h-5 w-5" />} label="Lernmodus starten" />
          <QuickAction href="/pruefung" icon={<ClipboardList className="h-5 w-5" />} label="Prüfung simulieren" />
          <QuickAction href="/bildfragen" icon={<ImageIcon className="h-5 w-5" />} label="Bildfragen üben" />
          <QuickAction href="/wiederholungen" icon={<RefreshCw className="h-5 w-5" />} label="Fehler wiederholen" />
        </div>
      </div>

      {/* Specialty overview */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Fachgebiete
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties
            .filter((s) => s.total > 0)
            .map((s, i) => {
              const Icon = getSpecialtyIcon(s.slug);
              return (
                <Link key={s.id} href={`/lernen/sitzung?specialty=${s.id}`}>
                  <Card
                    className="animate-fade-in-up h-full cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-accent-soft p-2.5 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-muted">{s.percent}%</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted">{s.total} Fragen</p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-secondary transition-all duration-500"
                        style={{ width: `${s.percent}%` }}
                      />
                    </div>
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>

      {stats.weakTopics.length > 0 && (
        <Card className="animate-fade-in-up">
          <CardTitle>Schwachstellen</CardTitle>
          <CardDescription>
            Fachgebiete mit den meisten als „nicht gewusst&quot; markierten Fragen.
          </CardDescription>
          <ul className="mt-4 space-y-2">
            {stats.weakTopics.map((topic) => (
              <li key={topic.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{topic.name}</span>
                <Badge tone="danger">{topic.count} Fragen</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recent activity */}
      <Card className="animate-fade-in-up">
        <CardTitle>Zuletzt bearbeitet</CardTitle>
        <CardDescription>Setzen Sie dort fort, wo Sie aufgehört haben.</CardDescription>
        {recent.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {recent.map((item) => {
              const confidence = item.confidence ? CONFIDENCE_LABELS[item.confidence] : null;
              return (
                <li key={item.questionId} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{item.questionText}</p>
                    <p className="text-xs text-muted">{item.specialtyNames.join(", ") || "—"}</p>
                  </div>
                  {confidence && <Badge tone={confidence.tone}>{confidence.label}</Badge>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Noch keine Aktivität — starten Sie mit dem Lernmodus, um loszulegen.
          </p>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: "accent" | "secondary" | "success" | "warning";
  delay: number;
}) {
  const toneClasses: Record<typeof tone, string> = {
    accent: "bg-accent-soft text-accent",
    secondary: "bg-secondary-soft text-secondary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  };
  return (
    <Card className="animate-fade-in-up hover:shadow-md" style={{ animationDelay: `${delay}ms` }}>
      <div className={`inline-flex rounded-lg p-2.5 ${toneClasses[tone]}`}>{icon}</div>
      <p className="mt-3 text-sm text-muted">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Card className="flex h-full cursor-pointer items-center gap-3 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
        <div className="rounded-lg bg-accent-soft p-2.5 text-accent">{icon}</div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </Card>
    </Link>
  );
}
