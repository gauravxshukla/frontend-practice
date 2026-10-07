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
import { SandpackCodeViewer, SandpackProvider } from '@codesandbox/sandpack-react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Clock, Eye, Lock, RotateCcw, Undo2 } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import Markdown from '../../components/Markdown';
import {
  breadcrumbOf,
  getNeighbours,
  getQuestion,
  loadQuestionFiles,
  loadRunnerAssets,
  loadSolutionSource,
  type FileMap,
  type Question,
  type RunnerAssets,
} from '../../lib/content/catalog';
import { clearDraft, loadDraft } from '../../lib/drafts';
import { useProgress } from '../../lib/progress';
import { useTheme } from '../../lib/theme';
import { usePersistentState } from '../../lib/usePersistentState';
import CodeWorkspace from './CodeWorkspace';
import Workspace from './Workspace';
import { sandpackThemes } from './sandpackThemes';

const MIN_PROMPT = 300;
const MAX_PROMPT_RATIO = 0.6;

type LeftTab = 'description' | 'notes' | 'solution';

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
  const [width, setWidth] = usePersistentState('fp:promptWidth', 440);

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

function SolutionCode({ question }: { question: Question }) {
  const { resolved } = useTheme();
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    loadSolutionSource(question).then((src) => setCode(src ?? ''));
  }, [question]);

  if (code === null) return <WorkspaceSkeleton />;
  return (
    <SandpackProvider files={{ '/solution.js': code }} theme={sandpackThemes[resolved]} options={{ activeFile: '/solution.js' }}>
      <div className="solution-viewer">
        <SandpackCodeViewer showLineNumbers wrapContent />
      </div>
    </SandpackProvider>
  );
}

function LockedPanel({ onReveal, what }: { onReveal: () => void; what: string }) {
  return (
    <div className="locked-panel">
      <Lock size={20} aria-hidden />
      <h3>{what} are hidden while you practise</h3>
      <p className="muted">Give it a real attempt first. They unlock automatically once your submission is accepted.</p>
      <button type="button" className="btn" onClick={onReveal}>
        <Eye size={14} aria-hidden /> Reveal anyway
      </button>
    </div>
  );
}

export default function QuestionPage() {
  const slug = useParams()['*'] ?? '';
  const question = getQuestion(slug);
  const navigate = useNavigate();
  const progress = useProgress();
  const bodyRef = useRef<HTMLDivElement>(null);
  const divider = useResizablePrompt(bodyRef);

  const isCode = question?.type === 'js' || question?.type === 'dsa';
  const solved = question ? progress[question.slug] === 'solved' : false;

  const [leftTab, setLeftTab] = useState<LeftTab>('description');
  const [revealed, setRevealed] = useState(false);
  // Code questions
  const [assets, setAssets] = useState<RunnerAssets | null>(null);
  // Machine-coding questions
  const [uiView, setUiView] = useState<'attempt' | 'solution'>('attempt');
  const [starter, setStarter] = useState<FileMap | null>(null);
  const [solutionFiles, setSolutionFiles] = useState<FileMap | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!question) return;
    let cancelled = false;
    setLeftTab('description');
    setRevealed(false);
    setAssets(null);
    setUiView('attempt');
    setStarter(null);
    setSolutionFiles(null);
    if (question.type === 'js' || question.type === 'dsa') {
      loadRunnerAssets(question).then((a) => !cancelled && setAssets(a));
    } else {
      loadQuestionFiles(question, 'starter').then((files) => {
        if (!cancelled) setStarter({ ...files, ...(loadDraft(question.slug) ?? {}) });
      });
    }
    return () => {
      cancelled = true;
    };
  }, [question]);

  useEffect(() => {
    if (uiView !== 'solution' || solutionFiles || !question) return;
    loadQuestionFiles(question, 'solution').then(setSolutionFiles);
  }, [uiView, solutionFiles, question]);

  const { prev, next } = question ? getNeighbours(question) : {};

  // Alt+←/→ moves between questions in the same topic.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) navigate(`/q/${prev.slug}`);
      if (e.key === 'ArrowRight' && next) navigate(`/q/${next.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate]);

  const onAccepted = useCallback(() => setRevealed(true), []);

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

  const unlocked = revealed || solved;
  const reveal = () => {
    if (window.confirm('Reveal the reference solution and notes?')) setRevealed(true);
  };

  const resetUi = () => {
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
    setUiView('attempt');
  };

  const tabs: { id: LeftTab; label: string }[] = [
    { id: 'description', label: 'Description' },
    ...(question.notes ? [{ id: 'notes' as const, label: 'Notes' }] : []),
    ...(isCode && question.hasSolution ? [{ id: 'solution' as const, label: 'Solution' }] : []),
  ];

  return (
    <div className="question-page">
      <header className="question-header">
        <div className="question-heading">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumbOf(question).map((g, i, all) => (
              <span key={g.id} className="breadcrumb-item">
                {i > 0 && <ChevronRight size={12} aria-hidden />}
                {i === all.length - 1 ? <Link to={`/topics/${g.id}`}>{g.label}</Link> : g.label}
              </span>
            ))}
          </nav>
          <div className="question-title-row">
            <h1>{question.title}</h1>
            <DifficultyBadge difficulty={question.difficulty} />
            {solved && (
              <span className="solved-pill">
                <CheckCircle2 size={13} aria-hidden /> Solved
              </span>
            )}
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
          {!isCode &&
            (uiView === 'attempt' ? (
              <>
                <button type="button" className="btn" onClick={resetUi}>
                  <RotateCcw size={14} aria-hidden /> Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setRevealed(true);
                    setUiView('solution');
                  }}
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
            ))}
        </div>
      </header>

      <div className="question-body" ref={bodyRef} style={{ '--prompt-width': `${divider.width}px` } as CSSProperties}>
        <section className="prompt-panel" aria-label="Problem">
          <div className="panel-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={leftTab === t.id}
                onClick={() => setLeftTab(t.id)}
              >
                {t.label}
                {t.id !== 'description' && !unlocked && <Lock size={11} aria-label="locked" />}
              </button>
            ))}
          </div>
          <div className="panel-scroll">
            {leftTab === 'description' && (
              <>
                {question.tags.length > 0 && (
                  <div className="tag-list">
                    {question.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
                <Markdown>{question.prompt}</Markdown>
              </>
            )}
            {leftTab === 'notes' &&
              (unlocked ? <Markdown>{question.notes}</Markdown> : <LockedPanel what="Notes" onReveal={reveal} />)}
            {leftTab === 'solution' &&
              (unlocked ? <SolutionCode question={question} /> : <LockedPanel what="Solutions" onReveal={reveal} />)}
          </div>
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

        <section className="workspace-panel" aria-label="Workspace">
          {isCode ? (
            assets ? (
              <CodeWorkspace question={question} assets={assets} onAccepted={onAccepted} />
            ) : (
              <WorkspaceSkeleton />
            )
          ) : (
            <>
              {uiView === 'solution' && <p className="solution-banner">Reference solution · read-only</p>}
              {uiView === 'attempt' &&
                (starter ? (
                  <Workspace key={`${question.slug}:${resetKey}`} question={question} files={starter} draftSlug={question.slug} />
                ) : (
                  <WorkspaceSkeleton />
                ))}
              {uiView === 'solution' &&
                (solutionFiles ? (
                  <Workspace key={`${question.slug}:solution`} question={question} files={solutionFiles} readOnly />
                ) : (
                  <WorkspaceSkeleton />
                ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
