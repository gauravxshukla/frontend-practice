import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DifficultyBadge, Tag } from '../../components/Badges';
import type { Question } from '../../lib/content/catalog';
import { questionUrl } from '../../lib/routes';

/** A question in a list: title, a few tags, difficulty, and optional trailing info. */
export default function QuestionRow({ q, meta }: { q: Question; meta?: ReactNode }) {
  return (
    <li>
      <Link to={questionUrl(q)} className="question-row">
        <span className="question-row-title">{q.title}</span>
        <span className="question-row-tags">
          {q.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </span>
        {meta}
        <DifficultyBadge difficulty={q.difficulty} />
      </Link>
    </li>
  );
}
