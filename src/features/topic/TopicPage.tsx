import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import { findGroup, groupPath, questionsIn, type Difficulty, type QuestionGroup } from '../../lib/content/catalog';
import { useProgress, type Status } from '../../lib/progress';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
type StatusFilter = 'all' | 'todo' | 'solved';

function StatusIcon({ status }: { status?: Status }) {
  if (status === 'solved') return <CheckCircle2 size={16} className="status-solved" aria-label="Solved" />;
  if (status === 'attempted') return <CircleDot size={16} className="status-attempted" aria-label="Attempted" />;
  return <Circle size={16} className="status-todo" aria-label="Not started" />;
}

function ProgressBar({ solved, total }: { solved: number; total: number }) {
  const pct = total ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="topic-progress" aria-label={`${solved} of ${total} solved`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="muted">
        {solved} / {total} solved
      </span>
    </div>
  );
}

/** Parent groups (DSA, Machine coding) show their topics as cards. */
function GroupOverview({ group }: { group: QuestionGroup }) {
  const progress = useProgress();
  return (
    <div className="topic-grid">
      {group.children.map((child) => {
        const items = questionsIn(child);
        const solved = items.filter((q) => progress[q.slug] === 'solved').length;
        return (
          <Link key={child.id} to={`/topics/${child.id}`} className="topic-card">
            <span className="topic-card-title">{child.label}</span>
            <span className="muted topic-card-count">{items.length} questions</span>
            <ProgressBar solved={solved} total={items.length} />
          </Link>
        );
      })}
    </div>
  );
}

export default function TopicPage() {
  const id = useParams()['*'] ?? '';
  const group = findGroup(id);
  const progress = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [status, setStatus] = useState<StatusFilter>('all');

  if (!group) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Topic not found</h2>
          <Link to="/">Back to practice</Link>
        </div>
      </div>
    );
  }

  const items = questionsIn(group);
  const solved = items.filter((q) => progress[q.slug] === 'solved').length;
  const parents = groupPath(id).slice(0, -1);
  const visible = items.filter(
    (q) =>
      (!difficulty || q.difficulty === difficulty) &&
      (status === 'all' || (status === 'solved') === (progress[q.slug] === 'solved')),
  );
  const isDsa = id.startsWith('dsa/');

  return (
    <div className="page page-wide">
      <header className="page-header">
        {parents.length > 0 && <p className="eyebrow">{parents.map((p) => p.label).join(' / ')}</p>}
        <h1>{group.label}</h1>
        <ProgressBar solved={solved} total={items.length} />
      </header>

      {group.children.length > 0 ? (
        <GroupOverview group={group} />
      ) : (
        <>
          <div className="toolbar">
            <div className="segmented" role="radiogroup" aria-label="Difficulty">
              {(['', ...DIFFICULTIES] as const).map((d) => (
                <button key={d || 'any'} type="button" role="radio" aria-checked={difficulty === d} onClick={() => setDifficulty(d)}>
                  {d ? d[0].toUpperCase() + d.slice(1) : 'All'}
                </button>
              ))}
            </div>
            <div className="segmented" role="radiogroup" aria-label="Status">
              {(['all', 'todo', 'solved'] as const).map((s) => (
                <button key={s} type="button" role="radio" aria-checked={status === s} onClick={() => setStatus(s)}>
                  {s === 'all' ? 'Any status' : s === 'todo' ? 'To do' : 'Solved'}
                </button>
              ))}
            </div>
          </div>

          {visible.length ? (
            <ol className="question-list topic-list">
              {visible.map((q) => (
                <li key={q.slug}>
                  <Link to={`/q/${q.slug}`} className="question-row">
                    <StatusIcon status={progress[q.slug]} />
                    {isDsa && q.order !== undefined && <span className="row-order">{q.order}</span>}
                    <span className="question-row-title">{q.title}</span>
                    <span className="question-row-tags">
                      {q.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </span>
                    {!q.hasSolution && <span className="tag tag-warn">prompt only</span>}
                    <DifficultyBadge difficulty={q.difficulty} />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="empty-state">
              <p className="muted">No questions match these filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
