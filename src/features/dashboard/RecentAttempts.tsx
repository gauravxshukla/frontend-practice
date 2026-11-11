import { CircleDot } from 'lucide-react';
import type { Question } from '../../lib/content/catalog';
import type { Status } from '../../lib/progress';
import { recentAttempts, relativeTime } from '../../lib/stats';
import QuestionRow from './QuestionRow';

interface Props {
  questions: Question[];
  progress: Record<string, Status>;
  touched: Record<string, number>;
  now: number;
}

/** Questions you started but haven't solved, newest first. Hidden when there are none. */
export default function RecentAttempts({ questions, progress, touched, now }: Props) {
  const recent = recentAttempts(questions, progress, touched);
  if (!recent.length) return null;
  return (
    <section className="home-section" aria-labelledby="recent-title">
      <h2 id="recent-title">
        <CircleDot size={13} className="status-attempted" aria-hidden /> Recently attempted
      </h2>
      <ul className="question-list">
        {recent.map(({ question, at }) => (
          <QuestionRow
            key={question.slug}
            q={question}
            meta={at ? <span className="question-row-when">{relativeTime(at, now)}</span> : undefined}
          />
        ))}
      </ul>
    </section>
  );
}
