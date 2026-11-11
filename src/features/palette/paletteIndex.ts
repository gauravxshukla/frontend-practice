import type { LucideIcon } from 'lucide-react';
import { breadcrumbOf, questions, questionTree, type Question, type QuestionGroup } from '../../lib/content/catalog';
import { notes, noteSections } from '../../lib/content/notes';
import { quizDecks } from '../../lib/content/quiz';
import type { Status } from '../../lib/progress';
import { groupUrl, notesUrl, questionUrl, quizUrl } from '../../lib/routes';

export type PaletteKind = 'question' | 'topic' | 'deck' | 'note' | 'action';

export interface PaletteItem {
  /** `q:<slug>`, `t:<groupId>`, `d:<slug>`, `n:<slug>`, `ns:<sectionId>`, `a:<name>`. */
  id: string;
  kind: PaletteKind;
  title: string;
  /** Breadcrumb or short context, e.g. `DSA · NeetCode 150 › Trees`. */
  subtitle?: string;
  /** Matched too, never shown: tags, difficulty, track. */
  keywords: string[];
  /** Where it goes. Actions have `run` instead (or as well). */
  href?: string;
  question?: Question;
}

export interface PaletteAction extends PaletteItem {
  kind: 'action';
  run?: () => void;
  kbd?: string;
  icon?: LucideIcon;
}

export interface PaletteSection {
  id: string;
  label: string;
  items: PaletteItem[];
}

function topicItems(groups: QuestionGroup[], trail: string[] = []): PaletteItem[] {
  return groups.flatMap((g) => [
    {
      id: `t:${g.id}`,
      kind: 'topic' as const,
      title: g.label,
      subtitle: trail.length ? trail.join(' › ') : 'Track',
      keywords: g.id.split('/'),
      href: groupUrl(g.id),
    },
    ...topicItems(g.children, [...trail, g.label]),
  ]);
}

let index: PaletteItem[] | null = null;

/** Everything the palette can find, built once from the bundled content. */
export function buildIndex(): PaletteItem[] {
  index ??= [
    ...questions.map(
      (q): PaletteItem => ({
        id: `q:${q.slug}`,
        kind: 'question',
        title: q.title,
        subtitle: breadcrumbOf(q)
          .map((g) => g.label)
          .join(' › '),
        keywords: [...q.tags, q.difficulty, q.track, q.type],
        href: questionUrl(q),
        question: q,
      }),
    ),
    ...topicItems(questionTree),
    ...quizDecks.map(
      (d): PaletteItem => ({
        id: `d:${d.slug}`,
        kind: 'deck',
        title: d.title,
        subtitle: `Quiz · ${d.cards.length} cards`,
        keywords: ['quiz', 'flashcards'],
        href: quizUrl(d.slug),
      }),
    ),
    ...noteSections.map(
      (s): PaletteItem => ({
        id: `ns:${s.id}`,
        kind: 'note',
        title: s.label,
        subtitle: `Notes · ${s.notes.length} ${s.notes.length === 1 ? 'note' : 'notes'}`,
        keywords: ['notes'],
        href: notesUrl(s.id),
      }),
    ),
    ...notes.map(
      (n): PaletteItem => ({
        id: `n:${n.slug}`,
        kind: 'note',
        title: n.title,
        subtitle: `Notes › ${n.section}`,
        keywords: ['notes'],
        href: notesUrl(n.slug),
      }),
    ),
  ];
  return index;
}

/**
 * What the palette shows before you type: questions you've started, pages you
 * visited recently, and the main places to go.
 */
export function suggestions(
  items: PaletteItem[],
  progress: Record<string, Status>,
  recent: string[],
  jumpTo: PaletteItem[],
): PaletteSection[] {
  const byHref = new Map(items.filter((i) => i.href).map((i) => [i.href!, i]));
  const recentItems = recent.map((href) => byHref.get(href)).filter((i): i is PaletteItem => Boolean(i));
  const attempted = (i: PaletteItem) => i.question && progress[i.question.slug] === 'attempted';

  // Started questions, most recently visited first.
  const startedAll = [...recentItems.filter(attempted), ...items.filter(attempted)];
  const continueItems = [...new Map(startedAll.map((i) => [i.id, i])).values()].slice(0, 4);
  const shown = new Set(continueItems.map((i) => i.id));
  const recentShown = recentItems.filter((i) => !shown.has(i.id)).slice(0, 5);

  return [
    { id: 'continue', label: 'Continue', items: continueItems },
    { id: 'recent', label: 'Recent', items: recentShown },
    { id: 'jump', label: 'Jump to', items: jumpTo },
  ].filter((s) => s.items.length > 0);
}
