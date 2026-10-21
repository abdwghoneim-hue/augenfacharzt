import Link from "next/link";
import { requireApprovedUser } from "@/lib/guards";
import { getHomeStats } from "@/lib/stats";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const user = await requireApprovedUser();
  const stats = await getHomeStats(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Willkommen, {user.username}</h1>
        <p className="mt-1 text-sm text-muted">
          AugenFacharzt – Mündliche Prüfung: Ihre private Lernplattform für die
          Facharztprüfung Augenheilkunde.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardDescription>Fragen insgesamt</CardDescription>
          <p className="mt-1 text-3xl font-semibold text-foreground">{stats.totalPublished}</p>
        </Card>
        <Card>
          <CardDescription>Noch nicht bearbeitet</CardDescription>
          <p className="mt-1 text-3xl font-semibold text-foreground">{stats.remaining}</p>
        </Card>
        <Card>
          <CardDescription>Heute zur Wiederholung fällig</CardDescription>
          <p className="mt-1 text-3xl font-semibold text-accent">{stats.dueCount}</p>
        </Card>
      </div>

      {stats.weakTopics.length > 0 && (
        <Card>
          <CardTitle>Schwachstellen</CardTitle>
          <CardDescription>
            Fachgebiete mit den meisten als „nicht gewusst&quot; markierten Fragen.
          </CardDescription>
          <ul className="mt-4 space-y-2">
            {stats.weakTopics.map((topic) => (
              <li key={topic.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{topic.name}</span>
                <span className="text-muted">{topic.count} Fragen</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Weiter lernen</CardTitle>
          <CardDescription>Setzen Sie Ihr Training im Lernmodus fort.</CardDescription>
        </div>
        <Link href="/lernen">
          <Button type="button">Lernmodus starten</Button>
        </Link>
      </Card>
    </div>
  );
}
