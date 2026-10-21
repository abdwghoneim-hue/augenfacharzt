import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImportUploadForm } from "@/components/admin/ImportUploadForm";

const STATUS_LABELS: Record<string, { label: string; tone: "neutral" | "warning" | "success" | "danger" }> = {
  PROCESSING: { label: "Wird verarbeitet", tone: "neutral" },
  NEEDS_REVIEW: { label: "Prüfung erforderlich", tone: "warning" },
  REVIEWED: { label: "Geprüft", tone: "success" },
  FAILED: { label: "Fehlgeschlagen", tone: "danger" },
};

export default async function ImportAdminPage() {
  const batches = await prisma.importBatch.findMany({
    orderBy: { uploadedAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dokumente hochladen</h1>
        <p className="mt-1 text-sm text-muted">
          Fragensammlungen importieren. Erkannte Fragen werden als Entwürfe angelegt und müssen vor
          Veröffentlichung geprüft werden.
        </p>
      </div>

      <Card>
        <CardTitle>Neue Datei importieren</CardTitle>
        <div className="mt-4">
          <ImportUploadForm />
        </div>
      </Card>

      <Card>
        <CardTitle>Bisherige Importe</CardTitle>
        <CardDescription>Für mehrere Dateien: Vorgang pro Datei wiederholen.</CardDescription>
        <ul className="mt-4 divide-y divide-border">
          {batches.map((batch) => {
            const status = STATUS_LABELS[batch.status] ?? { label: batch.status, tone: "neutral" as const };
            return (
              <li key={batch.id} className="flex items-center justify-between py-3">
                <div>
                  <Link href={`/admin/import/${batch.id}`} className="text-sm text-foreground hover:text-accent">
                    {batch.fileName}
                  </Link>
                  <p className="text-xs text-muted">
                    {batch._count.questions} Fragen erkannt ·{" "}
                    {new Date(batch.uploadedAt).toLocaleString("de-DE")}
                  </p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </li>
            );
          })}
          {batches.length === 0 && (
            <li className="py-6 text-center text-sm text-muted">Noch keine Dateien importiert.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
