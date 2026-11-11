import { useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Flame } from 'lucide-react';
import type { Activity } from '../../lib/activity';
import { heatmap, streaks } from '../../lib/stats';

const WEEKS = 26;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const longDate = (day: string) =>
  new Date(`${day}T00:00`).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const shortDate = (day: string) => new Date(`${day}T00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
const sessions = (n: number) => `${n} session${n === 1 ? '' : 's'}`;

/** LeetCode-style practice calendar: one cell per day, darker = more sessions. */
export default function ActivityHeatmap({ activity, today }: { activity: Activity; today: string }) {
  const { columns, months } = useMemo(() => heatmap(activity.days, today, WEEKS), [activity.days, today]);
  const { current, longest } = useMemo(() => streaks(activity.days, today), [activity.days, today]);
  const activeDays = Object.entries(activity.days)
    .filter(([, n]) => n > 0)
    .sort(([a], [b]) => (a < b ? 1 : -1));
  const scrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens the grid scrolls; start at the latest weeks.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const firstColumnDay = columns[0][0]?.date ?? today;
  const summary = activeDays.length
    ? `Practised on ${activeDays.length} day${activeDays.length === 1 ? '' : 's'}. Current streak ${current} day${current === 1 ? '' : 's'}, longest ${longest}.`
    : 'No practice recorded yet.';

  return (
    <section className="dash-card activity" aria-labelledby="activity-title">
      <div className="activity-head">
        <h2 id="activity-title" className="dash-card-title">
          Activity
        </h2>
        <p className="activity-stats">
          <span className={`streak${current ? ' on' : ''}`}>
            <Flame size={15} aria-hidden />
            <strong>{current}</strong> day streak
          </span>
          <span>
            Best <strong>{longest}</strong>
          </span>
          <span>
            <strong>{activeDays.length}</strong> active day{activeDays.length === 1 ? '' : 's'}
          </span>
        </p>
      </div>

      <div className="heatmap-scroll" ref={scrollRef}>
        <div className="heatmap" role="img" aria-label={summary} style={{ '--weeks': WEEKS } as CSSProperties}>
          <div className="heatmap-months" aria-hidden>
            {months.map((m) => (
              <span key={`${m.label}-${m.column}`} style={{ gridColumn: m.column + 1 }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="heatmap-days" aria-hidden>
            {DAY_LABELS.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
          <div className="heatmap-grid" aria-hidden>
            {columns.flatMap((column, w) =>
              column.map((cell, d) =>
                cell ? (
                  <span
                    key={cell.date}
                    className={`heat-cell level-${cell.level}${cell.date === today ? ' today' : ''}`}
                    data-tooltip={`${cell.count ? sessions(cell.count) : 'No practice'} · ${longDate(cell.date)}`}
                    data-tooltip-side="top"
                  />
                ) : (
                  <span key={`f-${w}-${d}`} className="heat-cell future" />
                ),
              ),
            )}
          </div>
        </div>
      </div>

      <div className="activity-foot">
        <p className="dash-muted">
          {!activeDays.length
            ? 'Run or submit any question to start your streak.'
            : activity.since > firstColumnDay
              ? `Recorded since ${shortDate(activity.since)}.`
              : `Last ${WEEKS} weeks.`}
        </p>
        <div className="heat-legend" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`heat-cell level-${l}`} />
          ))}
          More
        </div>
      </div>

      {activeDays.length > 0 && (
        <details className="activity-details">
          <summary>Activity details</summary>
          <table>
            <caption className="sr-only">Practice sessions per day, newest first</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {activeDays.slice(0, 30).map(([day, n]) => (
                <tr key={day}>
                  <td>{longDate(day)}</td>
                  <td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  );
}
