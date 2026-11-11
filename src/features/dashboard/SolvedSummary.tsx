import type { Difficulty, Question } from '../../lib/content/catalog';
import type { Status } from '../../lib/progress';
import { difficultySummary } from '../../lib/stats';

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

/** The headline: questions solved, then a meter per difficulty. */
export default function SolvedSummary({ questions, progress }: { questions: Question[]; progress: Record<string, Status> }) {
  const byDifficulty = difficultySummary(questions, progress);
  const solved = DIFFICULTIES.reduce((n, d) => n + byDifficulty[d.id].solved, 0);
  const attempted = questions.filter((q) => progress[q.slug] === 'attempted').length;

  return (
    <section className="dash-card solved-summary" aria-labelledby="solved-title">
      <h2 id="solved-title" className="dash-card-title">
        Solved
      </h2>
      <p className="solved-hero">
        <span className="solved-hero-value">{solved}</span>
        <span className="solved-hero-total">/ {questions.length}</span>
      </p>
      <p className="dash-muted">{attempted ? `${attempted} more in progress` : 'Solve a question to start filling these in.'}</p>
      <ul className="meters">
        {DIFFICULTIES.map(({ id, label }) => {
          const { solved: n, total } = byDifficulty[id];
          return (
            <li key={id} className={`meter-row tone-${id}`}>
              <span className="meter-label">{label}</span>
              <span className="meter-value">
                {n}
                <span className="dash-muted"> / {total}</span>
              </span>
              <span
                className="meter"
                role="meter"
                aria-label={`${label} solved`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={n}
                aria-valuetext={`${n} of ${total}`}
              >
                <span className="meter-fill" style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
