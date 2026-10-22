import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InteractiveCard, CardTitle, CardDescription } from "@/components/ui/Card";

export default async function LernenPage() {
  const specialties = await prisma.specialty.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { questions: { where: { question: { status: "PUBLISHED" } } } } } },
  });
  const totalPublished = await prisma.question.count({ where: { status: "PUBLISHED" } });

  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lernmodus</h1>
        <p className="mt-1 text-sm text-muted">
          Wählen Sie ein Fachgebiet oder lernen Sie fachgebietsübergreifend.
        </p>
      </div>

      <Link href="/lernen/sitzung">
        <InteractiveCard>
          <CardTitle>Alle Fachgebiete</CardTitle>
          <CardDescription>{totalPublished} veröffentlichte Fragen</CardDescription>
        </InteractiveCard>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specialties.map((s, i) => (
          <Link key={s.id} href={`/lernen/sitzung?specialty=${s.id}`}>
            <InteractiveCard
              className="h-full animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
            >
              <CardTitle className="text-base">{s.name}</CardTitle>
              <CardDescription>{s._count.questions} Fragen</CardDescription>
            </InteractiveCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
