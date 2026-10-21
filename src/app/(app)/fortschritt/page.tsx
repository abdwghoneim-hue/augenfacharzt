import { requireApprovedUser } from "@/lib/guards";
import { getProgressBySpecialty, getExamHistory } from "@/lib/fortschritt";
import { Card, CardTitle } from "@/components/ui/Card";

function Bar({ sicher, teilweise, nicht, total }: { sicher: number; teilweise: number; nicht: number; total: number }) {
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="bg-success" style={{ width: `${pct(sicher)}%` }} />
      <div className="bg-warning" style={{ width: `${pct(teilweise)}%` }} />
      <div className="bg-danger" style={{ width: `${pct(nicht)}%` }} />
    </div>
  );
}

export default async function FortschrittPage() {
  const user = await requireApprovedUser();
  const [bySpecialty, examHistory] = await Promise.all([
    getProgressBySpecialty(user.id),
    getExamHistory(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lernfortschritt</h1>
        <p className="mt-1 text-sm text-muted">Fortschritt nach Fachgebiet und Prüfungssimulationen.</p>
      </div>

      <Card>
        <CardTitle>Fortschritt nach Fachgebiet</CardTitle>
        <div className="mt-4 space-y-4">
          {bySpecialty.map((row) => (
            <div key={row.specialty}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-foreground">{row.specialty}</span>
                <span className="text-muted">
                  {row.reviewed} / {row.totalPublished}
                </span>
              </div>
              <Bar sicher={row.sicher} teilweise={row.teilweise} nicht={row.nichtGewusst} total={row.totalPublished} />
            </div>
          ))}
          {bySpecialty.length === 0 && (
            <p className="text-sm text-muted">Noch keine veröffentlichten Fragen vorhanden.</p>
          )}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" /> Sicher
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> Teilweise sicher
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" /> Nicht gewusst
          </span>
        </div>
      </Card>

      <Card>
        <CardTitle>Letzte Prüfungssimulationen</CardTitle>
        <ul className="mt-4 divide-y divide-border">
          {examHistory.map((session) => (
            <li key={session.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-foreground">
                {session.mode === "SPECIALTY" ? "Fachgebiet" : session.mode === "IMAGE" ? "Bildfragen" : "Gemischt"}
              </span>
              <span className="text-muted">{session._count.answers} Fragen</span>
              <span className="text-muted">
                {session.completedAt ? new Date(session.completedAt).toLocaleDateString("de-DE") : ""}
              </span>
            </li>
          ))}
          {examHistory.length === 0 && (
            <li className="py-6 text-center text-sm text-muted">
              Noch keine abgeschlossene Prüfungssimulation.
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
