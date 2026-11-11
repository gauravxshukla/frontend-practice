import { describe, expect, it } from 'vitest';
import { findGroup, getQuestion, questions } from '../../lib/content/catalog';
import { getNote, getNoteSection, notes, noteSections } from '../../lib/content/notes';
import { getDeck, quizDecks } from '../../lib/content/quiz';
import { buildIndex, suggestions, type PaletteItem } from './paletteIndex';

const resolves = (href: string) => {
  const [, kind, ...rest] = href.split('/');
  const path = rest.join('/');
  if (kind === 'q') return Boolean(getQuestion(path));
  if (kind === 'topics') return Boolean(findGroup(path));
  if (kind === 'quiz') return Boolean(getDeck(path));
  if (kind === 'notes') return Boolean(getNote(path) || getNoteSection(path));
  return false;
};

describe('buildIndex', () => {
  const index = buildIndex();

  it('indexes every question, deck, note and note section once, with unique ids', () => {
    const count = (kind: string) => index.filter((i) => i.kind === kind).length;
    expect(count('question')).toBe(questions.length);
    expect(count('deck')).toBe(quizDecks.length);
    expect(count('note')).toBe(notes.length + noteSections.length);
    expect(count('topic')).toBeGreaterThan(10);
    expect(new Set(index.map((i) => i.id)).size).toBe(index.length);
  });

  it('links every item somewhere that exists', () => {
    const broken = index.filter((i) => !i.href || !resolves(i.href)).map((i) => i.id);
    expect(broken).toEqual([]);
  });

  it('gives questions a breadcrumb and their tags as keywords', () => {
    const q = index.find((i) => i.question?.tags.length)!;
    expect(q.subtitle).toBeTruthy();
    expect(q.keywords).toEqual(expect.arrayContaining(q.question!.tags));
  });
});

describe('suggestions', () => {
  const index = buildIndex();
  const [q1, q2, q3] = index.filter((i) => i.kind === 'question');
  const topic = index.find((i) => i.kind === 'topic')!;
  const jump: PaletteItem[] = [topic];

  it('shows only "Jump to" without any history', () => {
    expect(suggestions(index, {}, [], jump).map((s) => s.id)).toEqual(['jump']);
  });

  it('puts started questions first (recent ones first) and skips them in Recent', () => {
    const progress = { [q1.question!.slug]: 'attempted' as const, [q2.question!.slug]: 'attempted' as const };
    const sections = suggestions(index, progress, [q2.href!, q3.href!, '/q/does-not-exist'], jump);
    expect(sections.find((s) => s.id === 'continue')!.items.map((i) => i.id)).toEqual([q2.id, q1.id]);
    expect(sections.find((s) => s.id === 'recent')!.items.map((i) => i.id)).toEqual([q3.id]);
  });
});
