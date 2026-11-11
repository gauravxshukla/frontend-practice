import { questionsIn, type Difficulty, type Question, type QuestionGroup } from './content/catalog';
import type { Status } from './progress';

// Pure progress maths for the dashboard. Days are local calendar days, `YYYY-MM-DD`.

export type DayCounts = Record<string, number>;
type Progress = Record<string, Status>;

const pad = (n: number) => String(n).padStart(2, '0');

export function localDay(at: number | Date): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateOf(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(day: string, n: number): string {
  const d = dateOf(day);
  d.setDate(d.getDate() + n);
  return localDay(d);
}

/** Current streak (ending today, or yesterday: today isn't over yet) and the longest ever. */
export function streaks(days: DayCounts, today: string): { current: number; longest: number } {
  const active = (day: string) => (days[day] ?? 0) > 0;
  let current = 0;
  let day = active(today) ? today : addDays(today, -1);
  while (active(day)) {
    current += 1;
    day = addDays(day, -1);
  }
  let longest = 0;
  let run = 0;
  let previous = '';
  for (const d of Object.keys(days).filter(active).sort()) {
    run = previous && addDays(previous, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = d;
  }
  return { current, longest: Math.max(longest, current) };
}

/** Heat level of a day's count, 0–4. */
export function level(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export interface HeatCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * The last `weeks` weeks as columns of 7 days (Sunday first), ending with the
 * current week. Days after today are null. `months` labels the first column of each month.
 */
export function heatmap(days: DayCounts, today: string, weeks = 26) {
  const end = addDays(today, 6 - dateOf(today).getDay()); // this week's Saturday
  const start = addDays(end, -(weeks * 7 - 1));
  const columns: (HeatCell | null)[][] = [];
  const months: { label: string; column: number }[] = [];
  for (let w = 0; w < weeks; w++) {
    const column: (HeatCell | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      column.push(date > today ? null : { date, count: days[date] ?? 0, level: level(days[date] ?? 0) });
    }
    const first = addDays(start, w * 7);
    const month = dateOf(first).toLocaleString('en', { month: 'short' });
    if (!months.length || months[months.length - 1].label !== month) months.push({ label: month, column: w });
    columns.push(column);
  }
  return { columns, months };
}

export function difficultySummary(questions: Question[], progress: Progress): Record<Difficulty, { solved: number; total: number }> {
  const summary = { easy: { solved: 0, total: 0 }, medium: { solved: 0, total: 0 }, hard: { solved: 0, total: 0 } };
  for (const q of questions) {
    summary[q.difficulty].total += 1;
    if (progress[q.slug] === 'solved') summary[q.difficulty].solved += 1;
  }
  return summary;
}

/**
 * A track's progress and where to continue: the unsolved question touched most
 * recently, else the first unsolved one in order.
 */
export function trackSummary(group: QuestionGroup, progress: Progress, touched: Record<string, number>) {
  const items = questionsIn(group);
  const unsolved = items.filter((q) => progress[q.slug] !== 'solved');
  const lastTouched = unsolved
    .filter((q) => touched[q.slug])
    .sort((a, b) => touched[b.slug] - touched[a.slug])[0];
  return {
    solved: items.length - unsolved.length,
    total: items.length,
    next: lastTouched ?? unsolved[0],
    started: items.some((q) => progress[q.slug]),
  };
}

/** Started-but-unsolved questions, most recently touched first (untimed ones last, in order). */
export function recentAttempts(questions: Question[], progress: Progress, touched: Record<string, number>, limit = 6) {
  return questions
    .filter((q) => progress[q.slug] === 'attempted')
    .map((q, order) => ({ question: q, at: touched[q.slug] as number | undefined, order }))
    .sort((a, b) => (b.at ?? -1) - (a.at ?? -1) || a.order - b.order)
    .slice(0, limit)
    .map(({ question, at }) => ({ question, at }));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

/** "just now", "5 minutes ago", "yesterday", "3 days ago". */
export function relativeTime(at: number, now: number): string {
  const elapsed = now - at;
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, ms] of UNITS) {
    if (elapsed >= ms) return format.format(-Math.floor(elapsed / ms), unit);
  }
  return 'just now';
}
