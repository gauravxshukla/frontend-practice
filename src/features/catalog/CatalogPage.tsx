import { useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { useOpenSearch } from '../../app/openSearch';
import { useActivity } from '../../lib/activity';
import { questions, questionsIn, questionTree, type Difficulty } from '../../lib/content/catalog';
import { useProgress } from '../../lib/progress';
import { groupUrl } from '../../lib/routes';
import { keysFor } from '../../lib/shortcuts';
import { localDay } from '../../lib/stats';
import ActivityHeatmap from '../dashboard/ActivityHeatmap';
import QuestionRow from '../dashboard/QuestionRow';
import RecentAttempts from '../dashboard/RecentAttempts';
import SolvedSummary from '../dashboard/SolvedSummary';
import TrackProgress from '../dashboard/TrackProgress';
import '../dashboard/dashboard.css';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/** Search and filter every question, or browse topic by topic. */
function Browse() {
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

  return (
    <section className="browse" aria-labelledby="browse-title">
      <h2 id="browse-title" className="browse-title">
        Browse
      </h2>
      <div className="toolbar">
        <label className="input-with-icon">
          <Search size={14} aria-hidden />
          <input
            type="search"
            placeholder="Filter every question by title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter questions"
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
            <h3>
              Results <span className="muted">{results.length}</span>
            </h3>
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
        questionTree
          .filter((g) => g.children.length)
          .map((g) => (
            <section key={g.id} className="home-section">
              <h3>
                <Link to={groupUrl(g.id)}>{g.label}</Link>
              </h3>
              <div className="topic-grid">
                {g.children.map((child) => {
                  const items = questionsIn(child);
                  const solved = items.filter((q) => progress[q.slug] === 'solved').length;
                  const pct = items.length ? Math.round((solved / items.length) * 100) : 0;
                  return (
                    <Link key={child.id} to={groupUrl(child.id)} className="topic-card">
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
          ))
      )}
    </section>
  );
}

/** The dashboard: how far you've got, when you practised, and where to pick up. */
export default function CatalogPage() {
  const progress = useProgress();
  const activity = useActivity();
  const openSearch = useOpenSearch();
  const now = Date.now();

  return (
    <div className="page page-wide dashboard">
      <header className="page-header dashboard-header">
        <div>
          <h1>Practice</h1>
          <p className="muted">{questions.length} questions across JavaScript, DSA and machine coding.</p>
        </div>
        <button type="button" className="dashboard-search" onClick={() => openSearch()}>
          <Search size={15} aria-hidden />
          <span>Search…</span>
          <kbd className="kbd">{keysFor('search')}</kbd>
        </button>
      </header>

      <div className="dash-top">
        <SolvedSummary questions={questions} progress={progress} />
        <ActivityHeatmap activity={activity} today={localDay(now)} />
      </div>

      <TrackProgress tracks={questionTree} progress={progress} touched={activity.touched} />
      <RecentAttempts questions={questions} progress={progress} touched={activity.touched} now={now} />
      <Browse />
    </div>
  );
}
