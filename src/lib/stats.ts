import "server-only";
import { prisma } from "@/lib/prisma";

export async function getHomeStats(userId: string) {
  const [totalPublished, reviewed, dueCount, weakSpecialties] = await Promise.all([
    prisma.question.count({ where: { status: "PUBLISHED" } }),
    prisma.userProgress.count({
      where: { userId, confidence: { not: null }, question: { status: "PUBLISHED" } },
    }),
    prisma.userProgress.count({
      where: { userId, nextReviewAt: { lte: new Date() }, question: { status: "PUBLISHED" } },
    }),
    prisma.userProgress.groupBy({
      by: ["questionId"],
      where: { userId, confidence: "NICHT_GEWUSST", question: { status: "PUBLISHED" } },
    }),
  ]);

  const weakQuestionIds = weakSpecialties.map((row) => row.questionId);
  let weakTopics: { name: string; count: number }[] = [];
  if (weakQuestionIds.length > 0) {
    const links = await prisma.questionSpecialty.findMany({
      where: { questionId: { in: weakQuestionIds } },
      include: { specialty: true },
    });
    const counts = new Map<string, number>();
    for (const link of links) {
      counts.set(link.specialty.name, (counts.get(link.specialty.name) ?? 0) + 1);
    }
    weakTopics = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  return {
    totalPublished,
    reviewed,
    remaining: Math.max(totalPublished - reviewed, 0),
    dueCount,
    weakTopics,
  };
}
