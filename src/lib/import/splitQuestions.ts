export type QuestionBlock = {
  originalText: string;
  originalAnswer?: string;
  pageReference?: string;
};

const MAX_BLOCKS = 500;
const ANSWER_MARKER = /\n\s*antwort\s*:?\s*\n?/i;

function splitQuestionAndAnswer(raw: string): { originalText: string; originalAnswer?: string } {
  const match = ANSWER_MARKER.exec(raw);
  if (!match) return { originalText: raw.trim() };
  const originalText = raw.slice(0, match.index).trim();
  const originalAnswer = raw.slice(match.index + match[0].length).trim();
  return { originalText, originalAnswer: originalAnswer || undefined };
}

/**
 * Heuristic question splitter for imported PDF/DOCX/TXT text (Stage 1, no
 * AI/LLM available). Admins review and edit every extracted question before
 * publishing, so this only needs to be a reasonable starting point.
 */
export function splitTextIntoBlocks(text: string): QuestionBlock[] {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return [];

  const numberedMarker = /^\s*(?:frage\s*)?(\d{1,4})[.)]\s+/gim;
  const matches = [...normalized.matchAll(numberedMarker)];

  let rawBlocks: { text: string; pageReference?: string }[];

  if (matches.length >= 2) {
    rawBlocks = matches.map((m, i) => {
      const start = m.index ?? 0;
      const end = i + 1 < matches.length ? (matches[i + 1].index ?? normalized.length) : normalized.length;
      const content = normalized.slice(start + m[0].length, end).trim();
      return { text: content, pageReference: `Nr. ${m[1]}` };
    });
  } else {
    rawBlocks = normalized
      .split(/\n\s*\n+/)
      .map((p) => ({ text: p.trim() }))
      .filter((p) => p.text.length >= 15);
  }

  const blocks: QuestionBlock[] = rawBlocks
    .slice(0, MAX_BLOCKS)
    .map(({ text: blockText, pageReference }) => {
      const { originalText, originalAnswer } = splitQuestionAndAnswer(blockText);
      return { originalText, originalAnswer, pageReference };
    })
    .filter((b) => b.originalText.length >= 5);

  return blocks;
}
