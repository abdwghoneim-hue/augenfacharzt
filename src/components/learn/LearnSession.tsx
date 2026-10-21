"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LearnQuestion } from "@/lib/learning";
import { rateQuestionAction, setBookmarkAction } from "@/app/actions/progress";
import { Card, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MicInput } from "@/components/MicInput";

const IMAGE_PROMPTS = [
  "Beschreiben Sie den Befund.",
  "Was ist Ihre Verdachtsdiagnose?",
  "Welche Differenzialdiagnosen kommen infrage?",
  "Welche weiteren Untersuchungen würden Sie durchführen?",
  "Wie würden Sie den Patienten behandeln?",
];

export function LearnSession({
  questions,
  title,
  mode = "lernen",
}: {
  questions: LearnQuestion[];
  title: string;
  mode?: "lernen" | "bildfragen";
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answer, setAnswer] = useState("");

  const question = questions[index];

  function goNext() {
    setIndex((i) => Math.min(i + 1, questions.length - 1));
    setRevealed(false);
    setBookmarked(false);
    setAnswer("");
  }

  async function rate(confidence: "SICHER" | "TEILWEISE" | "NICHT_GEWUSST") {
    if (!question) return;
    setSaving(true);
    await rateQuestionAction({ questionId: question.id, confidence });
    setSaving(false);
    goNext();
  }

  async function toggleBookmark() {
    if (!question) return;
    const next = !bookmarked;
    setBookmarked(next);
    await setBookmarkAction({ questionId: question.id, bookmarked: next });
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardDescription>
          In diesem Bereich sind noch keine veröffentlichten Fragen vorhanden.
        </CardDescription>
        <Link href="/lernen" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Zurück zur Fachgebietsauswahl
        </Link>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <CardDescription>Sie haben alle Fragen in dieser Auswahl bearbeitet.</CardDescription>
        <Link href="/lernen" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Zurück zur Fachgebietsauswahl
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <span className="text-sm text-muted">
          Frage {index + 1} / {questions.length}
        </span>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap gap-1">
          {question.specialties.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
        <p className="text-lg leading-relaxed text-foreground">{question.originalText}</p>

        {question.images.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {question.images.map((img, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-md border border-border bg-gray-50">
                <Image src={img.url} alt={img.caption ?? ""} fill className="object-contain" unoptimized />
              </div>
            ))}
          </div>
        )}

        {mode === "bildfragen" && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
            {IMAGE_PROMPTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}

        {!revealed && (
          <div className="mt-4">
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Ihre Antwort (optional, nur zur eigenen Übung)
            </p>
            <MicInput name="answer" value={answer} onChange={setAnswer} rows={4} />
          </div>
        )}

        {revealed && (
          <div className="mt-6 rounded-md border border-accent/20 bg-accent-soft p-4">
            <p className="mb-1 text-xs font-semibold uppercase text-accent">Musterantwort</p>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {question.modelAnswer ?? "Für diese Frage liegt noch keine Musterantwort vor."}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {!revealed ? (
            <Button type="button" onClick={() => setRevealed(true)}>
              Antwort anzeigen
            </Button>
          ) : (
            <>
              <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("SICHER")}>
                Sicher
              </Button>
              <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("TEILWEISE")}>
                Teilweise sicher
              </Button>
              <Button type="button" variant="secondary" disabled={saving} onClick={() => rate("NICHT_GEWUSST")}>
                Nicht gewusst
              </Button>
            </>
          )}
          <Button type="button" variant="ghost" onClick={toggleBookmark}>
            {bookmarked ? "★ Gemerkt" : "☆ Merken"}
          </Button>
          <Button type="button" variant="ghost" onClick={goNext}>
            Nächste Frage →
          </Button>
        </div>
      </Card>
    </div>
  );
}
