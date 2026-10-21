import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { startExamSessionAction } from "@/app/actions/exam";

export default async function PruefungPage() {
  const specialties = await prisma.specialty.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Prüfungssimulation</h1>
        <p className="mt-1 text-sm text-muted">
          Strukturierter Ablauf wie in der mündlichen Prüfung: Fall lesen, Antwort verfassen,
          Nachfragen, Musterantwort und Selbsteinschätzung.
        </p>
      </div>

      <Card>
        <CardTitle>Fachgebiet</CardTitle>
        <CardDescription>Prüfung zu einem bestimmten Fachgebiet.</CardDescription>
        <form action={startExamSessionAction} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="mode" value="SPECIALTY" />
          <Select name="specialtyId" required className="w-64">
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Button type="submit">Starten</Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Gemischte Prüfung</CardTitle>
        <CardDescription>Zufällige Auswahl fachgebietsübergreifend.</CardDescription>
        <form action={startExamSessionAction} className="mt-4">
          <input type="hidden" name="mode" value="MIXED" />
          <Button type="submit">Starten</Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Bildgestützte Prüfung</CardTitle>
        <CardDescription>Nur Fragen mit veröffentlichten klinischen Bildern.</CardDescription>
        <form action={startExamSessionAction} className="mt-4">
          <input type="hidden" name="mode" value="IMAGE" />
          <Button type="submit">Starten</Button>
        </form>
      </Card>
    </div>
  );
}
