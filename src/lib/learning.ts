import "server-only";
import { prisma } from "@/lib/prisma";
import { urlFor } from "@/lib/storage";

export type LearnImage = { url: string; caption: string | null; type: string };
export type LearnQuestion = {
  id: string;
  originalText: string;
  modelAnswer: string | null;
  specialties: string[];
  images: LearnImage[];
};

export async function getPublishedQuestions(options: {
  specialtyId?: string;
  onlyWithImages?: boolean;
  questionIds?: string[];
}): Promise<LearnQuestion[]> {
  const questions = await prisma.question.findMany({
    where: {
      status: "PUBLISHED",
      ...(options.specialtyId ? { specialties: { some: { specialtyId: options.specialtyId } } } : {}),
      ...(options.questionIds ? { id: { in: options.questionIds } } : {}),
      ...(options.onlyWithImages ? { images: { some: { status: "PUBLISHED" } } } : {}),
    },
    include: {
      specialties: { include: { specialty: true } },
      answers: { where: { type: "MODEL" } },
      images: { where: { status: "PUBLISHED" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return questions.map((q) => ({
    id: q.id,
    originalText: q.originalText,
    modelAnswer: q.answers[0]?.text ?? null,
    specialties: q.specialties.map((s) => s.specialty.name),
    images: q.images.map((img) => ({ url: urlFor(img.filePath), caption: img.caption, type: img.type })),
  }));
}
