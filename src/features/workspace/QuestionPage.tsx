import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Eye, Lightbulb, RotateCcw, Undo2 } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import Markdown from '../../components/Markdown';
import {
  breadcrumbOf,
  getNeighbours,
  getQuestion,
  loadQuestionFiles,
  type FileMap,
} from '../../lib/content/catalog';
import { clearDraft, loadDraft } from '../../lib/drafts';
import { usePersistentState } from '../../lib/usePersistentState';
import Workspace from './Workspace';

type View = 'attempt' | 'solution';

const MIN_PROMPT = 280;
const MAX_PROMPT_RATIO = 0.6;

function WorkspaceSkeleton() {
  return (
    <div className="workspace-skeleton" aria-busy="true" aria-label="Loading editor">
      <div className="skeleton-bar" style={{ width: '40%' }} />
      <div className="skeleton-bar" style={{ width: '75%' }} />
      <div className="skeleton-bar" style={{ width: '60%' }} />
      <div className="skeleton-bar" style={{ width: '30%' }} />
    </div>
  );
}

/** Draggable (and keyboard-adjustable) divider between prompt and workspace. */
function useResizablePrompt(containerRef: RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = usePersistentState('fp:promptWidth', 400);

  const clamp = useCallback(
    (px: number) => {
      const total = containerRef.current?.clientWidth ?? window.innerWidth;
      return Math.round(Math.min(Math.max(px, MIN_PROMPT), total * MAX_PROMPT_RATIO));
    },
    [containerRef],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const left = containerRef.current?.getBoundingClientRect().left ?? 0;
    // Iframes would swallow pointer events mid-drag.
    document.body.classList.add('is-resizing');
    const onMove = (ev: PointerEvent) => setWidth(clamp(ev.clientX - left));
    const onUp = () => {
      document.body.classList.remove('is-resizing');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setWidth((w) => clamp(w - 24));
    if (e.key === 'ArrowRight') setWidth((w) => clamp(w + 24));
  };

  return { width, onPointerDown, onKeyDown };
}

export default function QuestionPage() {
  const slug = useParams()['*'] ?? '';
  const question = getQuestion(slug);
  const navigate = useNavigate();
  const bodyRef = useRef<HTMLDivElement>(null);
  const divider = useResizablePrompt(bodyRef);

  const [view, setView] = useState<View>('attempt');
  const [starter, setStarter] = useState<FileMap | null>(null);
  const [solution, setSolution] = useState<FileMap | null>(null);
  // Bumping this remounts the sandbox, which is how Reset discards edits.
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!question) return;
    let cancelled = false;
    setView('attempt');
    setStarter(null);
    setSolution(null);
    loadQuestionFiles(question, 'starter').then((files) => {
      if (!cancelled) setStarter({ ...files, ...(loadDraft(question.slug) ?? {}) });
    });
    return () => {
      cancelled = true;
    };
  }, [question]);

  useEffect(() => {
    if (view !== 'solution' || solution || !question) return;
    loadQuestionFiles(question, 'solution').then(setSolution);
  }, [view, solution, question]);

  const { prev, next } = question ? getNeighbours(question) : {};

  // Alt+←/→ moves between questions in the same group.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) navigate(`/q/${prev.slug}`);
      if (e.key === 'ArrowRight' && next) navigate(`/q/${next.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate]);

  if (!question) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Question not found</h2>
          <p className="muted">
            Nothing lives at <code>{slug}</code>. <Link to="/">Browse questions</Link>
          </p>
        </div>
      </div>
    );
  }

  const reset = () => {
    if (!window.confirm('Discard your code and restore the starter?')) return;
    clearDraft(question.slug);
    loadQuestionFiles(question, 'starter').then((files) => {
      setStarter(files);
      setResetKey((k) => k + 1);
    });
  };

  const backToAttempt = () => {
    // The attempt sandbox unmounted while the solution was shown; remount it from the latest draft.
    setStarter((prevFiles) => (prevFiles ? { ...prevFiles, ...(loadDraft(question.slug) ?? {}) } : prevFiles));
    setView('attempt');
  };

  const crumbs = breadcrumbOf(question);

  return (
    <div className="question-page">
      <header className="question-header">
        <div className="question-heading">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c} className="breadcrumb-item">
                {i > 0 && <ChevronRight size={12} aria-hidden />}
                {c}
              </span>
            ))}
          </nav>
          <div className="question-title-row">
            <h1>{question.title}</h1>
            <DifficultyBadge difficulty={question.difficulty} />
            {question.estimatedMinutes ? (
              <span className="meta">
                <Clock size={13} aria-hidden /> {question.estimatedMinutes} min
              </span>
            ) : null}
          </div>
        </div>

        <div className="question-actions">
          <div className="btn-group" role="group" aria-label="Question navigation">
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!prev}
              onClick={() => prev && navigate(`/q/${prev.slug}`)}
              title={prev ? `Previous: ${prev.title} (Alt+←)` : 'No previous question'}
              aria-label="Previous question"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!next}
              onClick={() => next && navigate(`/q/${next.slug}`)}
              title={next ? `Next: ${next.title} (Alt+→)` : 'No next question'}
              aria-label="Next question"
            >
              <ArrowRight size={15} />
            </button>
          </div>
          {view === 'attempt' ? (
            <>
              <button type="button" className="btn" onClick={reset}>
                <RotateCcw size={14} aria-hidden /> Reset
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setView('solution')}
                disabled={!question.hasSolution}
                title={question.hasSolution ? undefined : 'No reference solution has been written yet'}
              >
                <Eye size={14} aria-hidden /> {question.hasSolution ? 'Reveal solution' : 'No solution yet'}
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={backToAttempt}>
              <Undo2 size={14} aria-hidden /> Back to my code
            </button>
          )}
        </div>
      </header>

      <div className="question-body" ref={bodyRef} style={{ '--prompt-width': `${divider.width}px` } as CSSProperties}>
        <section className="prompt-panel" aria-label="Problem">
          {question.tags.length > 0 && (
            <div className="tag-list">
              {question.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
          <Markdown>{question.prompt}</Markdown>
          {view === 'solution' && question.notes && (
            <aside className="callout">
              <h2 className="callout-title">
                <Lightbulb size={15} aria-hidden /> Notes
              </h2>
              <Markdown>{question.notes}</Markdown>
            </aside>
          )}
        </section>

        <div
          className="resize-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize problem panel"
          aria-valuenow={divider.width}
          tabIndex={0}
          onPointerDown={divider.onPointerDown}
          onKeyDown={divider.onKeyDown}
        />

        <section className="workspace-panel" aria-label={view === 'solution' ? 'Reference solution' : 'Your code'}>
          {view === 'solution' && <p className="solution-banner">Reference solution · read-only</p>}
          {view === 'attempt' &&
            (starter ? (
              <Workspace key={`${question.slug}:${resetKey}`} question={question} files={starter} draftSlug={question.slug} />
            ) : (
              <WorkspaceSkeleton />
            ))}
          {view === 'solution' &&
            (solution ? (
              <Workspace key={`${question.slug}:solution`} question={question} files={solution} readOnly />
            ) : (
              <WorkspaceSkeleton />
            ))}
        </section>
      </div>
    </div>
  );
}
