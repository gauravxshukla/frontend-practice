import { describe, expect, it } from 'vitest';
import { questions, questionTree, type QuestionGroup } from '../../src/lib/content/catalog';
import { groupUrl, legacyRedirect, notesUrl, parseRoute, questionUrl, quizUrl } from '../../src/lib/routes';

const allGroups = (groups: QuestionGroup[]): QuestionGroup[] => groups.flatMap((g) => [g, ...allGroups(g.children)]);
const q = (slug: string) => questions.find((x) => x.slug === slug)!;

describe('routes', () => {
  it('gives questions short, guessable URLs', () => {
    expect(questionUrl(q('dsa/arrays-hashing/two-sum'))).toBe('/dsa/two-sum');
    expect(questionUrl(q('machine-coding/react/data-table'))).toBe('/react/data-table');
    expect(questionUrl(q('machine-coding/react/like-button'), 'native')).toBe('/react/like-button/native');
    expect(questionUrl(q('machine-coding/vanilla/accordion'), 'native')).toBe('/vanilla/accordion');
  });

  it('round-trips every question, and every React question on native', () => {
    for (const question of questions) {
      expect(parseRoute(questionUrl(question))).toEqual({ kind: 'question', question, platform: 'web' });
      if (question.type === 'react') {
        expect(parseRoute(questionUrl(question, 'native'))).toEqual({ kind: 'question', question, platform: 'native' });
      }
    }
  });

  it('round-trips every track and topic', () => {
    expect(groupUrl('dsa')).toBe('/dsa');
    expect(groupUrl('dsa/trees')).toBe('/dsa/topics/trees');
    expect(groupUrl('machine-coding')).toBe('/machine-coding');
    expect(groupUrl('machine-coding/react')).toBe('/react');
    for (const group of allGroups(questionTree)) expect(parseRoute(groupUrl(group.id))).toEqual({ kind: 'group', group });
  });

  it('tells the binary-search topic and question apart', () => {
    expect(parseRoute('/dsa/binary-search')).toMatchObject({ kind: 'question', question: { slug: 'dsa/binary-search/binary-search' } });
    expect(parseRoute('/dsa/topics/binary-search')).toMatchObject({ kind: 'group', group: { id: 'dsa/binary-search' } });
  });

  it('parses home, quiz and notes, and reports unknown paths with their parts', () => {
    expect(parseRoute('/')).toEqual({ kind: 'home' });
    expect(parseRoute(quizUrl('react'))).toEqual({ kind: 'quiz', deck: 'react' });
    expect(parseRoute(quizUrl())).toEqual({ kind: 'quiz', deck: undefined });
    expect(parseRoute(notesUrl('a/b'))).toEqual({ kind: 'notes', slug: 'a/b' });
    expect(parseRoute('/dsa/no-such-question')).toEqual({ kind: 'unknown', track: 'dsa', name: 'no-such-question' });
    expect(parseRoute('/dsa/two-sum/native')).toMatchObject({ kind: 'unknown' }); // native is React only
    expect(parseRoute('/nope')).toEqual({ kind: 'unknown' });
  });

  it('redirects old /q/ and /topics/ links', () => {
    expect(legacyRedirect('/q/dsa/arrays-hashing/two-sum')).toBe('/dsa/two-sum');
    expect(legacyRedirect('/q/machine-coding/react/like-button', '?platform=native')).toBe('/react/like-button/native');
    expect(legacyRedirect('/topics/dsa/trees')).toBe('/dsa/topics/trees');
    expect(legacyRedirect('/topics/machine-coding/react')).toBe('/react');
    expect(legacyRedirect('/topics/js')).toBe('/js');
    expect(legacyRedirect('/q/does/not/exist')).toBeNull();
    expect(legacyRedirect('/dsa/two-sum')).toBeNull();
  });
});
