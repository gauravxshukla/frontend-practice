import { describe, expect, it } from 'vitest';
import { findGroup, questions } from '../../src/lib/content/catalog';
import {
  addDays,
  difficultySummary,
  heatmap,
  level,
  localDay,
  recentAttempts,
  relativeTime,
  streaks,
  trackSummary,
} from '../../src/lib/stats';

const days = (...list: string[]) => Object.fromEntries(list.map((d) => [d, 1]));

describe('days', () => {
  it('uses local calendar days and crosses month and year ends', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('streaks', () => {
  const today = '2026-11-11';
  it('is zero with no activity', () => expect(streaks({}, today)).toEqual({ current: 0, longest: 0 }));
  it('counts today', () => expect(streaks(days(today), today)).toEqual({ current: 1, longest: 1 }));
  it('still counts a streak that ended yesterday (today is not over)', () => {
    expect(streaks(days('2026-11-09', '2026-11-10'), today).current).toBe(2);
  });
  it('breaks on a missed day', () => expect(streaks(days('2026-11-08', '2026-11-11'), today).current).toBe(1));
  it('remembers the longest run, across a year end', () => {
    const history = days('2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02', '2026-11-11');
    expect(streaks(history, today)).toEqual({ current: 1, longest: 4 });
  });
  it('ignores days with a zero count', () => expect(streaks({ [today]: 0 }, today).current).toBe(0));
});

describe('heatmap', () => {
  const today = '2026-11-11'; // a Wednesday
  const { columns, months } = heatmap({ [today]: 5, '2026-11-01': 1 }, today, 26);
  it('is 26 Sunday-first weeks ending this week, with future days empty', () => {
    expect(columns).toHaveLength(26);
    columns.forEach((c) => expect(c).toHaveLength(7));
    const last = columns[25];
    expect(last[0]?.date).toBe('2026-11-08'); // Sunday
    expect(last[3]).toEqual({ date: today, count: 5, level: 3 });
    expect(last.slice(4)).toEqual([null, null, null]);
  });
  it('labels each month once', () => {
    expect(new Set(months.map((m) => m.label)).size).toBe(months.length);
    expect(months[0].column).toBe(0);
  });
  it('maps counts to levels', () => {
    expect([0, 1, 2, 3, 4, 6, 7, 40].map(level)).toEqual([0, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe('summaries', () => {
  const dsa = findGroup('dsa')!;
  const trees = findGroup('dsa/trees')!;
  const [first, second, third] = trees.questions;

  it('counts solved per difficulty', () => {
    const s = difficultySummary(questions, { [first.slug]: 'solved', [second.slug]: 'attempted' });
    expect(s.easy.total + s.medium.total + s.hard.total).toBe(questions.length);
    expect(s[first.difficulty].solved).toBe(1);
  });

  it('continues with the last-touched unsolved question, else the first unsolved one', () => {
    const progress = { [first.slug]: 'solved' as const, [second.slug]: 'attempted' as const, [third.slug]: 'attempted' as const };
    const touched = { [second.slug]: 100, [third.slug]: 200, [first.slug]: 300 };
    const summary = trackSummary(dsa, progress, touched);
    expect(summary.next).toBe(third);
    expect(summary.solved).toBe(1);
    expect(trackSummary(trees, {}, {}).next).toBe(first);
    expect(trackSummary(trees, Object.fromEntries(trees.questions.map((q) => [q.slug, 'solved' as const])), {}).next).toBeUndefined();
  });

  it('lists attempted questions newest first, untimed ones last', () => {
    const progress = { [first.slug]: 'attempted' as const, [second.slug]: 'attempted' as const, [third.slug]: 'solved' as const };
    const list = recentAttempts(questions, progress, { [second.slug]: 50, [third.slug]: 99 });
    expect(list.map((r) => r.question)).toEqual([second, first]);
    expect(list[0].at).toBe(50);
  });
});

describe('relativeTime', () => {
  const now = new Date(2026, 10, 11, 12).getTime();
  it('reads naturally', () => {
    expect(relativeTime(now - 20_000, now)).toBe('just now');
    expect(relativeTime(now - 5 * 60_000, now)).toBe('5 minutes ago');
    expect(relativeTime(now - 3 * 3_600_000, now)).toBe('3 hours ago');
    expect(relativeTime(now - 86_400_000, now)).toBe('yesterday');
    expect(relativeTime(now - 4 * 86_400_000, now)).toBe('4 days ago');
  });
});
