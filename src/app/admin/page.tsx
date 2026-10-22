import Link from "next/link";
import { Users, FileQuestion, ImageIcon, FileUp, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const [
    pendingUsers,
    questionsInReview,
    imagesInReview,
    recentBatches,
    publishedCount,
    draftCount,
  ] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.question.count({ where: { status: { not: "PUBLISHED" } } }),
    prisma.questionImage.count({ where: { status: { not: "PUBLISHED" } } }),
    prisma.importBatch.findMany({ orderBy: { uploadedAt: "desc" }, take: 5 }),
    prisma.question.count({ where: { status: "PUBLISHED" } }),
    prisma.question.count({ where: { status: "DRAFT" } }),
  ]);

  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Administrator-Übersicht</h1>
        <p className="mt-1 text-sm text-muted">Status der Inhaltsverwaltung auf einen Blick.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/benutzer">
          <Card className="h-full cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
            <div className="inline-flex rounded-lg bg-warning-soft p-2.5 text-warning">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted">Ausstehende Registrierungen</p>
            <p className="text-2xl font-semibold text-foreground">{pendingUsers}</p>
          </Card>
        </Link>
        <Link href="/admin/freigabe">
          <Card className="h-full cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
            <div className="inline-flex rounded-lg bg-accent-soft p-2.5 text-accent">
              <FileQuestion className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted">Fragen zur Prüfung</p>
            <p className="text-2xl font-semibold text-foreground">{questionsInReview}</p>
          </Card>
        </Link>
        <Link href="/admin/freigabe">
          <Card className="h-full cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
            <div className="inline-flex rounded-lg bg-secondary-soft p-2.5 text-secondary">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted">Bilder zur Freigabe</p>
            <p className="text-2xl font-semibold text-foreground">{imagesInReview}</p>
          </Card>
        </Link>
        <Link href="/admin/fragen">
          <Card className="h-full cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
            <div className="inline-flex rounded-lg bg-success-soft p-2.5 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted">Veröffentlicht / Entwurf</p>
            <p className="text-2xl font-semibold text-foreground">
              {publishedCount} <span className="text-base font-normal text-muted">/ {draftCount}</span>
            </p>
          </Card>
        </Link>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Zuletzt importierte Dokumente</CardTitle>
            <CardDescription>Die letzten 5 Importe.</CardDescription>
          </div>
          <div className="rounded-lg bg-accent-soft p-2.5 text-accent">
            <FileUp className="h-5 w-5" />
          </div>
        </div>
        {recentBatches.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {recentBatches.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3">
                <Link href={`/admin/import/${b.id}`} className="text-sm text-foreground hover:text-accent">
                  {b.fileName}
                </Link>
                <div className="flex items-center gap-2">
                  <Badge tone={b.status === "REVIEWED" ? "success" : b.status === "FAILED" ? "danger" : "warning"}>
                    {b.status}
                  </Badge>
                  <span className="text-xs text-muted">
                    {new Date(b.uploadedAt).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Noch keine Dokumente importiert.</p>
        )}
      </Card>
    </div>
  );
}
