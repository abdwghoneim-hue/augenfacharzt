import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { ContentStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusControl } from "@/components/admin/StatusControl";
import {
  batchApproveQuestionsAction,
  batchPublishQuestionsAction,
} from "@/app/actions/questions";

export default async function ReviewQueuePage() {
  const [questions, cases, images] = await Promise.all([
    prisma.question.findMany({
      where: { status: { not: "PUBLISHED" } },
      include: { specialties: { include: { specialty: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.clinicalCase.findMany({
      where: { status: { not: "PUBLISHED" } },
      include: { question: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.questionImage.findMany({
      where: { status: { not: "PUBLISHED" } },
      include: { question: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Inhaltsfreigabe</h1>
        <p className="mt-1 text-sm text-muted">
          Nur freigegebene und veröffentlichte Inhalte sind für Lernende sichtbar.
        </p>
      </div>

      <Card>
        <CardTitle>Fragen ({questions.length})</CardTitle>
        <CardDescription>
          Einzeln prüfen oder ausgewählte Fragen gesammelt freigeben/veröffentlichen.
        </CardDescription>
        <form className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Button type="submit" formAction={batchApproveQuestionsAction} variant="secondary" size="sm">
              Ausgewählte freigeben
            </Button>
            <Button type="submit" formAction={batchPublishQuestionsAction} size="sm">
              Ausgewählte veröffentlichen
            </Button>
          </div>
          <ul className="divide-y divide-border rounded-md border border-border">
            {questions.map((q) => (
              <li key={q.id} className="flex items-center gap-3 px-4 py-3">
                <input type="checkbox" name="ids" value={q.id} className="rounded border-border" />
                <div className="flex-1">
                  <Link href={`/admin/fragen/${q.id}`} className="text-sm text-foreground hover:text-accent">
                    {q.originalText.slice(0, 120)}
                    {q.originalText.length > 120 ? "…" : ""}
                  </Link>
                  <p className="text-xs text-muted">
                    {q.specialties.map((s) => s.specialty.name).join(", ") || "Kein Fachgebiet"}
                  </p>
                </div>
                <ContentStatusBadge status={q.status} />
              </li>
            ))}
            {questions.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">
                Keine offenen Fragen zur Prüfung.
              </li>
            )}
          </ul>
        </form>
      </Card>

      <Card>
        <CardTitle>Klinische Fälle ({cases.length})</CardTitle>
        <ul className="mt-4 divide-y divide-border rounded-md border border-border">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <Link href={`/admin/fragen/${c.questionId}`} className="text-sm text-foreground hover:text-accent">
                  {c.scenarioText.slice(0, 120)}
                  {c.scenarioText.length > 120 ? "…" : ""}
                </Link>
              </div>
              <StatusControl entityType="ClinicalCase" id={c.id} status={c.status} />
            </li>
          ))}
          {cases.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted">Keine offenen Fälle.</li>
          )}
        </ul>
      </Card>

      <Card>
        <CardTitle>Bilder ({images.length})</CardTitle>
        <ul className="mt-4 divide-y divide-border rounded-md border border-border">
          {images.map((img) => (
            <li key={img.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <Link href={`/admin/fragen/${img.questionId}`} className="text-sm text-foreground hover:text-accent">
                  {img.caption || img.filePath.split("/").pop()}
                </Link>
                <p className="text-xs text-muted">Zu: {img.question.originalText.slice(0, 80)}</p>
              </div>
              <StatusControl entityType="QuestionImage" id={img.id} status={img.status} />
            </li>
          ))}
          {images.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted">Keine offenen Bilder.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
