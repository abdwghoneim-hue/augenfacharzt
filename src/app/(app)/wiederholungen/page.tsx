import Link from "next/link";
import { requireApprovedUser } from "@/lib/guards";
import { getDueReviewIds, getBookmarkedQuestions } from "@/lib/reviews";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { deleteMyProgressAction } from "@/app/actions/progress";

export default async function WiederholungenPage() {
  const user = await requireApprovedUser();
  const [dueIds, bookmarks] = await Promise.all([
    getDueReviewIds(user.id),
    getBookmarkedQuestions(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Meine Wiederholungen</h1>
        <p className="mt-1 text-sm text-muted">
          Fragen, die anhand Ihrer Selbsteinschätzung erneut fällig sind, priorisiert nach
          Schwierigkeit.
        </p>
      </div>

      <Card className="flex items-center justify-between">
        <div>
          <CardTitle>{dueIds.length} fällige Fragen</CardTitle>
          <CardDescription>Basierend auf Ihrer letzten Selbsteinschätzung.</CardDescription>
        </div>
        {dueIds.length > 0 && (
          <Link href="/wiederholungen/sitzung">
            <Button type="button">Wiederholung starten</Button>
          </Link>
        )}
      </Card>

      <Card>
        <CardTitle>Gemerkte Fragen ({bookmarks.length})</CardTitle>
        <ul className="mt-4 divide-y divide-border">
          {bookmarks.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm text-foreground">{b.question.originalText.slice(0, 140)}</p>
                <p className="text-xs text-muted">
                  {b.question.specialties.map((s) => s.specialty.name).join(", ") || "—"}
                </p>
              </div>
              <form action={deleteMyProgressAction}>
                <input type="hidden" name="questionId" value={b.questionId} />
                <Button type="submit" variant="ghost" size="sm">
                  Fortschritt zurücksetzen
                </Button>
              </form>
            </li>
          ))}
          {bookmarks.length === 0 && (
            <li className="py-6 text-center text-sm text-muted">Keine gemerkten Fragen.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
