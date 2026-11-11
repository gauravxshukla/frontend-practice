import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
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
  loadSolutionSources,
  type FileMap,
  type Question,
  type RunnerAssets,
} from '../../lib/content/catalog';
import { applyDraft, clearDraft, draftKey, loadDraft } from '../../lib/drafts';
import { useProgress } from '../../lib/progress';
import { useTheme } from '../../lib/theme';
import { usePersistentState } from '../../lib/usePersistentState';
import { LANGUAGES, languageInfo } from '../runner/languages/registry';
import type { LanguageId } from '../runner/languages/types';
import CodeWorkspace from './CodeWorkspace';
import type { Platform } from './native/nativeSetup';
import Workspace from './Workspace';
import { sandpackThemes } from './sandpackThemes';
import { useEditorLanguages } from './useEditorLanguages';

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

type SolutionSources = Partial<Record<LanguageId, string>>;

/** Read-only reference solution(s): JS always, Python where a solution.py exists. */
function SolutionCode({ question }: { question: Question }) {
  const { resolved } = useTheme();
  const [sources, setSources] = useState<SolutionSources | null>(null);
  // The language picked in the editor (only read here); a tab click overrides it.
  const [preferred] = usePersistentState<LanguageId>('fp:dsaLanguage', 'javascript');
  const [picked, setPicked] = useState<LanguageId | null>(null);
  useEffect(() => {
    loadSolutionSources(question).then(setSources);
  }, [question]);

  const current: LanguageId = picked ?? (sources?.[preferred] !== undefined ? preferred : 'javascript');
  const editorLanguages = useEditorLanguages(current);
  const file = languageInfo(current).file;
  const files = useMemo(() => ({ [file]: sources?.[current] ?? '' }), [file, sources, current]);
  const options = useMemo(() => ({ activeFile: file }), [file]);

  if (sources === null) return <WorkspaceSkeleton />;
  const available = LANGUAGES.filter((l) => sources[l.id] !== undefined);
  const missingPreferred = question.type === 'dsa' && picked === null && current !== preferred;

  return (
    <>
      {available.length > 1 && (
        <div className="solution-langs" role="tablist" aria-label="Solution language">
          {available.map((l) => (
            <button key={l.id} type="button" role="tab" aria-selected={l.id === current} onClick={() => setPicked(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      )}
      {missingPreferred && (
        <p className="solution-note">
          Reference shown in {languageInfo(current).label}: this question has no {languageInfo(preferred).label} reference yet.
        </p>
      )}
      <SandpackProvider key={current} files={files} theme={sandpackThemes[resolved]} options={options}>
        <div className="solution-viewer">
          <SandpackCodeViewer key={editorLanguages.length} showLineNumbers wrapContent additionalLanguages={editorLanguages} />
        </div>
      </SandpackProvider>
    </>
  );
}

const PLATFORMS: { id: Platform; label: string; hint: string }[] = [
  { id: 'web', label: 'Web', hint: 'React DOM' },
  { id: 'native', label: 'Native', hint: 'React Native (rendered with react-native-web)' },
];

/** Web / Native switch for React questions. */
function PlatformToggle({ value, onChange }: { value: Platform; onChange: (p: Platform) => void }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Platform">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={value === p.id}
          title={p.hint}
          onClick={() => onChange(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const progress = useProgress();
  const bodyRef = useRef<HTMLDivElement>(null);
  const divider = useResizablePrompt(bodyRef);

  const isCode = question?.type === 'js' || question?.type === 'dsa';
  // React questions can be solved in React Native; `?platform=native` keeps it deep-linkable.
  const platform: Platform = question?.type === 'react' && searchParams.get('platform') === 'native' ? 'native' : 'web';
  const draftId = question ? draftKey(question.slug, platform) : '';
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
    setLeftTab('description');
    setRevealed(false);
  }, [question]);

  useEffect(() => {
    if (!question) return;
    let cancelled = false;
    setAssets(null);
    setUiView('attempt');
    setStarter(null);
    setSolutionFiles(null);
    if (question.type === 'js' || question.type === 'dsa') {
      loadRunnerAssets(question).then((a) => !cancelled && setAssets(a));
    } else {
      loadQuestionFiles(question, 'starter', platform).then((files) => {
        if (!cancelled) setStarter(applyDraft(files, loadDraft(draftKey(question.slug, platform))));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [question, platform]);

  useEffect(() => {
    if (uiView !== 'solution' || solutionFiles || !question) return;
    loadQuestionFiles(question, 'solution', platform).then(setSolutionFiles);
  }, [uiView, solutionFiles, question, platform]);

  const { prev, next } = question ? getNeighbours(question) : {};
  // Moving between React questions stays on the platform you're practising.
  const hrefOf = useCallback(
    (q: Question) => (q.type === 'react' && platform === 'native' ? `/q/${q.slug}?platform=native` : `/q/${q.slug}`),
    [platform],
  );

  // Alt+←/→ moves between questions in the same topic.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) navigate(hrefOf(prev));
      if (e.key === 'ArrowRight' && next) navigate(hrefOf(next));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate, hrefOf]);

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
    clearDraft(draftId);
    loadQuestionFiles(question, 'starter', platform).then((files) => {
      setStarter(files);
      setResetKey((k) => k + 1);
    });
  };

  const backToAttempt = () => {
    // The attempt sandbox unmounted while the solution was shown; remount it from the latest draft.
    setStarter((prevFiles) => (prevFiles ? applyDraft(prevFiles, loadDraft(draftId)) : prevFiles));
    setUiView('attempt');
  };

  const hasUiSolution = platform === 'native' ? question.hasNativeSolution : question.hasSolution;
  const changePlatform = (next: Platform) =>
    setSearchParams(next === 'native' ? { platform: 'native' } : {}, { replace: true });

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
          {question.type === 'react' && <PlatformToggle value={platform} onChange={changePlatform} />}
          <div className="btn-group" role="group" aria-label="Question navigation">
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!prev}
              onClick={() => prev && navigate(hrefOf(prev))}
              title={prev ? `Previous: ${prev.title} (Alt+←)` : 'No previous question'}
              aria-label="Previous question"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!next}
              onClick={() => next && navigate(hrefOf(next))}
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
                  disabled={!hasUiSolution}
                  title={hasUiSolution ? undefined : `No ${platform === 'native' ? 'React Native ' : ''}reference solution has been written yet`}
                >
                  <Eye size={14} aria-hidden /> {hasUiSolution ? 'Reveal solution' : 'No solution yet'}
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
              {uiView === 'attempt' && platform === 'native' && !question.hasNativeStarter && (
                <p className="solution-banner">
                  No React Native starter for this question yet: build the prompt with React Native primitives.
                </p>
              )}
              {uiView === 'attempt' &&
                (starter ? (
                  <Workspace
                    key={`${question.slug}:${platform}:${resetKey}`}
                    question={question}
                    files={starter}
                    draftSlug={draftId}
                    platform={platform}
                  />
                ) : (
                  <WorkspaceSkeleton />
                ))}
              {uiView === 'solution' &&
                (solutionFiles ? (
                  <Workspace
                    key={`${question.slug}:${platform}:solution`}
                    question={question}
                    files={solutionFiles}
                    platform={platform}
                    readOnly
                  />
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
