import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Binary, Braces, LayoutGrid, Search, type LucideIcon } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import {
  countQuestions,
  questions,
  questionTree,
  type Difficulty,
  type Question,
  type QuestionGroup,
} from '../../lib/content/catalog';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const TRACK_META: Record<string, { icon: LucideIcon; blurb: string }> = {
  js: { icon: Braces, blurb: 'Polyfills, utilities and async patterns, checked by tests.' },
  dsa: { icon: Binary, blurb: 'Arrays, linked lists, intervals and sorting, checked by tests.' },
  'machine-coding': { icon: LayoutGrid, blurb: 'Build UI in React or vanilla JS with a live preview.' },
};

function allQuestions(group: QuestionGroup): Question[] {
  return [...group.questions, ...group.children.flatMap(allQuestions)];
}

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

function TrackCard({ group, active, onSelect }: { group: QuestionGroup; active: boolean; onSelect: () => void }) {
  const { icon: Icon, blurb } = TRACK_META[group.id];
  const items = allQuestions(group);
  const counts = DIFFICULTIES.map((d) => [d, items.filter((q) => q.difficulty === d).length] as const);

  return (
    <button type="button" className={`track-card${active ? ' active' : ''}`} onClick={onSelect} aria-pressed={active}>
      <span className="track-card-icon">
        <Icon size={18} aria-hidden />
      </span>
      <span className="track-card-title">
        {group.label}
        <span className="track-card-count">{countQuestions(group)}</span>
      </span>
      <span className="track-card-blurb">{blurb}</span>
      <DifficultyBar items={items} />
      <span className="track-card-legend">
        {counts.map(([d, n]) => (
          <span key={d}>
            <span className={`difficulty-dot dot-${d}`} /> {n} {d}
          </span>
        ))}
      </span>
    </button>
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
        {!q.hasSolution && <span className="tag tag-warn">prompt only</span>}
        <DifficultyBadge difficulty={q.difficulty} />
      </Link>
    </li>
  );
}

export default function CatalogPage() {
  // Filters live in the URL so a filtered list survives navigation and reloads.
  const [params, setParams] = useSearchParams();
  const track = params.get('track') ?? '';
  const difficulty = params.get('difficulty') ?? '';
  const [search, setSearch] = useState('');

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const term = search.trim().toLowerCase();
  const keep = useMemo(
    () => (q: Question) =>
      (!difficulty || q.difficulty === difficulty) &&
      (!term || q.title.toLowerCase().includes(term) || q.tags.some((t) => t.includes(term))),
    [difficulty, term],
  );

  // Flatten the tree into list sections: JavaScript, DSA, Machine coding · React, Machine coding · Vanilla JS.
  const sections = questionTree
    .filter((g) => !track || g.id === track)
    .flatMap((g) =>
      g.children.length
        ? g.children.map((c) => ({ id: c.id, label: `${g.label} · ${c.label}`, items: c.questions.filter(keep) }))
        : [{ id: g.id, label: g.label, items: g.questions.filter(keep) }],
    )
    .filter((s) => s.items.length);

  return (
    <div className="page page-wide">
      <header className="page-header">
        <h1>Practice</h1>
        <p className="muted">
          {questions.length} questions. Attempt one cold, run it, then reveal the reference solution.
        </p>
      </header>

      <div className="track-grid">
        {questionTree.map((g) => (
          <TrackCard key={g.id} group={g} active={track === g.id} onSelect={() => setFilter('track', track === g.id ? '' : g.id)} />
        ))}
      </div>

      <div className="toolbar">
        <label className="input-with-icon">
          <Search size={14} aria-hidden />
          <input
            type="search"
            placeholder="Search title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search questions"
          />
        </label>
        <div className="segmented" role="radiogroup" aria-label="Difficulty">
          {['', ...DIFFICULTIES].map((d) => (
            <button
              key={d || 'any'}
              type="button"
              role="radio"
              aria-checked={difficulty === d}
              onClick={() => setFilter('difficulty', d)}
            >
              {d ? d[0].toUpperCase() + d.slice(1) : 'All'}
            </button>
          ))}
        </div>
        {(track || difficulty || term) && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSearch('');
              setParams(new URLSearchParams(), { replace: true });
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {sections.map((s) => (
        <section key={s.id} className="catalog-section">
          <h2>
            {s.label} <span className="muted">{s.items.length}</span>
          </h2>
          <ul className="question-list">
            {s.items.map((q) => (
              <QuestionRow key={q.slug} q={q} />
            ))}
          </ul>
        </section>
      ))}

      {!sections.length && (
        <div className="empty-state">
          <p className="muted">No questions match these filters.</p>
        </div>
      )}
    </div>
  );
}
