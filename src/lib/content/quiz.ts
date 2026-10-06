import { parseFrontmatter } from './frontmatter.js';

export interface QuizCard {
  title: string;
  /** Shown up front: for output questions, the snippet. Empty for theory questions. */
  front: string;
  /** Hidden until revealed: output/behaviour + explanation, or the full theory answer. */
  back: string;
}

export interface QuizDeck {
  slug: string;
  title: string;
  description: string;
  cards: QuizCard[];
}

const decks = import.meta.glob('/content/quiz/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// A card starts at a numbered heading: "## 1. Title", "### 3) Title", "## 4 — Title".
const NUMBERED_HEADING = /^(#{2,4})\s+(?:\*\*)?\d+\s*[.)—–-]?\s*(.*)$/;
const ANY_HEADING = /^(#{1,6})\s/;
// Where the answer starts inside an output-prediction card.
const ANSWER_MARKER = /^\*\*(Output|Behavior|Behaviour|Answer|Expected)\b/i;

function cleanTitle(raw: string) {
  return raw.replace(/\*\*/g, '').trim();
}

function trimRule(text: string) {
  return text.replace(/(\n\s*---\s*)+$/g, '').trim();
}

/**
 * Splits an existing interview-notes markdown file into flashcards without
 * requiring a special format: each numbered heading becomes a card.
 */
export function parseDeck(markdown: string): { title: string; description: string; cards: QuizCard[] } {
  const { data, body } = parseFrontmatter(markdown);
  const lines = body.split('\n');

  const h1 = lines.find((l) => l.startsWith('# '));
  const numbered = lines.map((l) => NUMBERED_HEADING.exec(l)).filter(Boolean) as RegExpExecArray[];
  // Cards live at the shallowest level that has numbered headings.
  const cardLevel = Math.min(...numbered.map((m) => m[1].length));

  const cards: QuizCard[] = [];
  let current: { title: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const text = trimRule(current.lines.join('\n'));
    let markerIndex = current.lines.findIndex((l) => ANSWER_MARKER.test(l.trim()));
    if (markerIndex < 0) {
      // Snippet cards that only have an explanation: split at **Why** when
      // everything before it is a code block (theory answers never are).
      const whyIndex = current.lines.findIndex((l) => /^\*\*Why\b/.test(l.trim()));
      const before = current.lines.slice(0, whyIndex).join('\n').trim();
      if (whyIndex > 0 && /^```[\s\S]*```$/.test(before)) markerIndex = whyIndex;
    }
    if (markerIndex > 0) {
      cards.push({
        title: current.title,
        front: trimRule(current.lines.slice(0, markerIndex).join('\n')),
        back: trimRule(current.lines.slice(markerIndex).join('\n')),
      });
    } else {
      cards.push({ title: current.title, front: '', back: text });
    }
    current = null;
  };

  for (const line of lines) {
    const numberedMatch = NUMBERED_HEADING.exec(line);
    if (numberedMatch && numberedMatch[1].length === cardLevel) {
      flush();
      current = { title: cleanTitle(numberedMatch[2]), lines: [] };
      continue;
    }
    const heading = ANY_HEADING.exec(line);
    if (heading && heading[1].length < cardLevel) {
      // A higher-level section heading closes the current card.
      flush();
      continue;
    }
    current?.lines.push(line);
  }
  flush();

  return {
    title: data.title ?? (h1 ? cleanTitle(h1.slice(2)) : 'Quiz'),
    description: data.description ?? '',
    cards,
  };
}

export const quizDecks: QuizDeck[] = Object.entries(decks)
  .map(([path, raw]) => ({
    slug: path.replace('/content/quiz/', '').replace(/\.md$/, ''),
    ...parseDeck(raw),
  }))
  .filter((deck) => deck.cards.length > 0)
  .sort((a, b) => a.title.localeCompare(b.title));

export function getDeck(slug: string) {
  return quizDecks.find((d) => d.slug === slug);
}
