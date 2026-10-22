"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ExamQuestion } from "@/lib/exam";
import {
  saveExamAnswerAction,
  revealAndRateExamAnswerAction,
  completeExamSessionAction,
} from "@/app/actions/exam";
import { rateQuestionAction } from "@/app/actions/progress";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MicInput } from "@/components/MicInput";
import { Citations } from "@/components/Citations";

type Stage = "answering" | "followups" | "revealed";

export function ExamSessionView({
  examSessionId,
  questions,
}: {
  examSessionId: string;
  questions: ExamQuestion[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("answering");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  async function saveAndContinue() {
    if (!question) return;
    setSaving(true);
    await saveExamAnswerAction({ examSessionId, questionId: question.id, userAnswerText: answer });
    setSaving(false);
    setStage(question.followUps.length > 0 ? "followups" : "revealed");
  }

  async function rate(confidence: "SICHER" | "TEILWEISE" | "NICHT_GEWUSST") {
    if (!question) return;
    setSaving(true);
    await Promise.all([
      revealAndRateExamAnswerAction({ examSessionId, questionId: question.id, selfRating: confidence }),
      rateQuestionAction({ questionId: question.id, confidence }),
    ]);
    setSaving(false);

    if (isLast) {
      await completeExamSessionAction(examSessionId);
      router.push("/fortschritt");
      return;
    }
    setIndex((i) => i + 1);
    setStage("answering");
    setAnswer("");
  }

  if (!question) {
    return (
      <Card>
        <p className="text-sm text-muted">
          Für diese Auswahl sind noch keine veröffentlichten Fragen verfügbar.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Prüfungssimulation</h1>
        <span className="text-sm text-muted">
          Fall {index + 1} / {questions.length}
        </span>
      </div>

      <Card key={question.id} className="animate-fade-in-up">
        <p className="mb-1 text-xs font-semibold uppercase text-muted">Fall</p>
        <p className="text-lg leading-relaxed text-foreground">
          {question.scenarioText ?? question.originalText}
        </p>

        {question.images.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {question.images.map((img, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-md border border-border bg-gray-50">
                <Image src={img.url} alt={img.caption ?? ""} fill className="object-contain" unoptimized />
              </div>
            ))}
          </div>
        )}

        {stage === "answering" && (
          <div className="animate-fade-in-up mt-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Ihre Antwort</p>
            <MicInput name="answer" value={answer} onChange={setAnswer} />
            <Button type="button" disabled={saving} onClick={saveAndContinue}>
              {saving ? "Wird gespeichert …" : "Antwort speichern"}
            </Button>
          </div>
        )}

        {stage === "followups" && (
          <div className="animate-fade-in-up mt-6 space-y-4">
            <p className="text-sm font-semibold text-foreground">Prüfer-Nachfragen</p>
            <ul className="list-decimal space-y-2 pl-5 text-sm text-foreground">
              {question.followUps.map((f, i) => (
                <li key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  {f}
                </li>
              ))}
            </ul>
            <Button type="button" onClick={() => setStage("revealed")}>
              Musterantwort anzeigen
            </Button>
          </div>
        )}

        {stage === "revealed" && (
          <div className="animate-fade-in-up mt-6 space-y-4">
            <div className="rounded-md border border-border bg-gray-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-muted">Ihre Antwort</p>
              <p className="whitespace-pre-wrap text-sm text-foreground">{answer || "(keine Eingabe)"}</p>
            </div>
            <div className="rounded-md border border-accent/20 bg-accent-soft p-4">
              <p className="mb-1 text-xs font-semibold uppercase text-accent">
                Freigegebene Musterantwort
              </p>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {question.modelAnswer ?? "Für diese Frage liegt noch keine Musterantwort vor."}
              </p>
              <Citations citations={question.citations} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Selbsteinschätzung</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("SICHER")}>
                  Sicher
                </Button>
                <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("TEILWEISE")}>
                  Teilweise sicher
                </Button>
                <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("NICHT_GEWUSST")}>
                  Nicht gewusst
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted">
        Hinweis: Die Selbsteinschätzung ist eine persönliche Lernhilfe und kein offizielles Ergebnis
        der Facharztprüfung.
      </p>
    </div>
  );
}
