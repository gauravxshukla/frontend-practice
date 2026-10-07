import { useState } from 'react';
import { Link } from 'react-router';
import { Binary, Braces, CircleDot, LayoutGrid, Search, type LucideIcon } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import {
  questions,
  questionsIn,
  questionTree,
  type Difficulty,
  type Question,
  type QuestionGroup,
} from '../../lib/content/catalog';
import { useProgress } from '../../lib/progress';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const TRACK_META: Record<string, { icon: LucideIcon; blurb: string }> = {
  js: { icon: Braces, blurb: 'Polyfills, utilities and async patterns, graded by tests.' },
  dsa: { icon: Binary, blurb: 'The NeetCode 150, topic by topic, with hidden edge cases.' },
  'machine-coding': { icon: LayoutGrid, blurb: 'Build UI in React or vanilla JS with a live preview.' },
};

function DifficultyBar({ items }: { items: Question[] }) {
  return (
    <div className="difficulty-bar" aria-hidden>
      {DIFFICULTIES.map((d) => {
        const n = items.filter((q) => q.difficulty === d).length;
        return n ? <span key={d} className={`bar-${d}`} style={{ flexGrow: n }} /> : null;
      })}
    </div>
  );
}

function TrackCard({ group }: { group: QuestionGroup }) {
  const progress = useProgress();
  const { icon: Icon, blurb } = TRACK_META[group.id];
  const items = questionsIn(group);
  const solved = items.filter((q) => progress[q.slug] === 'solved').length;

  return (
    <Link to={`/topics/${group.id}`} className="track-card">
      <span className="track-card-icon">
        <Icon size={18} aria-hidden />
      </span>
      <span className="track-card-title">
        {group.label}
        <span className="track-card-count">{items.length}</span>
      </span>
      <span className="track-card-blurb">{blurb}</span>
      <DifficultyBar items={items} />
      <span className="track-card-legend">
        <span>
          {solved} / {items.length} solved
        </span>
        {group.children.length > 0 && <span>{group.children.length} topics</span>}
      </span>
    </Link>
  );
}

function QuestionRow({ q }: { q: Question }) {
  return (
    <li>
      <Link to={`/q/${q.slug}`} className="question-row">
        <span className="question-row-title">{q.title}</span>
        <span className="question-row-tags">
          {q.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </span>
        <DifficultyBadge difficulty={q.difficulty} />
      </Link>
    </li>
  );
}

export default function CatalogPage() {
  const progress = useProgress();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');

  const term = search.trim().toLowerCase();
  const searching = Boolean(term || difficulty);
  const results = searching
    ? questions.filter(
        (q) =>
          (!difficulty || q.difficulty === difficulty) &&
          (!term || q.title.toLowerCase().includes(term) || q.tags.some((t) => t.includes(term))),
      )
    : [];
  const inProgress = questions.filter((q) => progress[q.slug] === 'attempted').slice(0, 5);

  return (
    <div className="page page-wide">
      <header className="page-header">
        <h1>Practice</h1>
        <p className="muted">{questions.length} questions. Pick a topic, attempt it cold, run it, then submit.</p>
      </header>

      <div className="track-grid">
        {questionTree.map((g) => (
          <TrackCard key={g.id} group={g} />
        ))}
      </div>

      <div className="toolbar">
        <label className="input-with-icon">
          <Search size={14} aria-hidden />
          <input
            type="search"
            placeholder="Search every question by title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search questions"
          />
        </label>
        <div className="segmented" role="radiogroup" aria-label="Difficulty">
          {(['', ...DIFFICULTIES] as const).map((d) => (
            <button key={d || 'any'} type="button" role="radio" aria-checked={difficulty === d} onClick={() => setDifficulty(d)}>
              {d ? d[0].toUpperCase() + d.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {searching ? (
        results.length ? (
          <section className="catalog-section">
            <h2>
              Results <span className="muted">{results.length}</span>
            </h2>
            <ul className="question-list">
              {results.map((q) => (
                <QuestionRow key={q.slug} q={q} />
              ))}
            </ul>
          </section>
        ) : (
          <div className="empty-state">
            <p className="muted">No questions match.</p>
          </div>
        )
      ) : (
        <>
          {inProgress.length > 0 && (
            <section className="home-section">
              <h2>
                <CircleDot size={13} className="status-attempted" aria-hidden /> Continue where you left off
              </h2>
              <ul className="question-list">
                {inProgress.map((q) => (
                  <QuestionRow key={q.slug} q={q} />
                ))}
              </ul>
            </section>
          )}
          {questionTree
            .filter((g) => g.children.length)
            .map((g) => (
              <section key={g.id} className="home-section">
                <h2>{g.label}</h2>
                <div className="topic-grid">
                  {g.children.map((child) => {
                    const items = questionsIn(child);
                    const solved = items.filter((q) => progress[q.slug] === 'solved').length;
                    const pct = items.length ? Math.round((solved / items.length) * 100) : 0;
                    return (
                      <Link key={child.id} to={`/topics/${child.id}`} className="topic-card">
                        <span className="topic-card-title">{child.label}</span>
                        <span className="muted topic-card-count">
                          {solved ? `${solved} / ${items.length} solved` : `${items.length} questions`}
                        </span>
                        <div className="topic-progress">
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
        </>
      )}
    </div>
  );
}
