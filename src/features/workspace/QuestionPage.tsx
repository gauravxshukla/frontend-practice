import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { SandpackCodeViewer, SandpackProvider } from '@codesandbox/sandpack-react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Clock, Eye, Lock, RotateCcw, Undo2 } from 'lucide-react';
import { DifficultyBadge, Tag } from '../../components/Badges';
import Markdown from '../../components/Markdown';
import { useConfirm } from '../../components/overlay/ConfirmProvider';
import { useToast } from '../../components/overlay/ToastProvider';
import {
  breadcrumbOf,
  getNeighbours,
  loadQuestionFiles,
  loadRunnerAssets,
  loadSolutionSources,
  type FileMap,
  type Question,
  type RunnerAssets,
} from '../../lib/content/catalog';
import { applyDraft, clearDraft, draftKey, loadDraft, saveDraft } from '../../lib/drafts';
import { recordActivity } from '../../lib/activity';
import { markAttempted, useProgress } from '../../lib/progress';
import { useTheme } from '../../lib/theme';
import { ariaKeysFor, keysFor } from '../../lib/shortcuts';
import { groupUrl, parseRoute, questionUrl } from '../../lib/routes';
import { useColumnResize } from '../../lib/useColumnResize';
import { LANGUAGES, languageInfo } from '../runner/languages/registry';
import type { LanguageId } from '../runner/languages/types';
import { useOpenSearch } from '../../app/openSearch';
import CodeWorkspace from './CodeWorkspace';
import LayoutToggles from './LayoutToggles';
import MarkComplete from './MarkComplete';
import PromptStrip from './PromptStrip';
import { useWorkspaceLayout, type PanelId } from './useWorkspaceLayout';
import type { Platform } from './native/nativeSetup';
import Workspace from './Workspace';
import { sandpackThemes } from './sandpackThemes';
import { useEditorLanguages } from './useEditorLanguages';

const PROMPT_LIMITS = { unit: 'px', min: 300, max: 0.6 } as const;

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

type SolutionSources = Partial<Record<LanguageId, string>>;

/** Read-only reference solutions: JavaScript, plus Python / Java where they exist. Opens on JavaScript. */
function SolutionCode({ question }: { question: Question }) {
  const { resolved } = useTheme();
  const [sources, setSources] = useState<SolutionSources | null>(null);
  const [picked, setPicked] = useState<LanguageId | null>(null);
  useEffect(() => {
    loadSolutionSources(question).then(setSources);
  }, [question]);

  // Every question has a JavaScript reference, so it's the stable default; a tab click switches.
  const current: LanguageId = picked && sources?.[picked] !== undefined ? picked : 'javascript';
  const editorLanguages = useEditorLanguages(current);
  const file = languageInfo(current).file;
  const files = useMemo(() => ({ [file]: sources?.[current] ?? '' }), [file, sources, current]);
  const options = useMemo(() => ({ activeFile: file }), [file]);

  if (sources === null) return <WorkspaceSkeleton />;
  const available = LANGUAGES.filter((l) => sources[l.id] !== undefined);

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
          data-tooltip={p.hint}
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

/** A question page: `/dsa/two-sum`, `/react/like-button/native` (see src/lib/routes.ts). */
export default function QuestionPage() {
  const route = parseRoute(useLocation().pathname);
  const question = route.kind === 'question' ? route.question : undefined;
  const navigate = useNavigate();
  const openSearch = useOpenSearch();
  const progress = useProgress();
  const divider = useColumnResize('fp:promptWidth', 400, PROMPT_LIMITS);
  const confirm = useConfirm();
  const toast = useToast();

  const isCode = question?.type === 'js' || question?.type === 'dsa';
  // React questions can be solved in React Native, at `/react/<name>/native`.
  const platform: Platform = route.kind === 'question' ? route.platform : 'web';
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
  const [consoleErrors, setConsoleErrors] = useState(0);

  // Panels: code questions only have the description to hide; machine coding also files and preview.
  const panels = useMemo<PanelId[]>(() => (isCode ? ['description'] : ['description', 'files', 'preview']), [isCode]);
  const shownFiles = uiView === 'solution' ? solutionFiles : starter;
  const layout = useWorkspaceLayout({ panels, paths: useMemo(() => Object.keys(shownFiles ?? {}), [shownFiles]) });

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
  const hrefOf = useCallback((q: Question) => questionUrl(q, platform), [platform]);

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
  // Machine coding: the first edit since opening the question counts as practice.
  const slug = question?.slug;
  const onFirstEdit = useCallback(() => {
    if (!slug) return;
    markAttempted(slug);
    recordActivity(slug);
  }, [slug]);

  if (!question) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Question not found</h2>
          {route.kind === 'unknown' && route.name ? (
            <>
              <p className="muted">
                There's no question called <code>{route.name}</code>
                {route.track ? (
                  <>
                    {' '}
                    in <code>{route.track}</code>
                  </>
                ) : null}
                .
              </p>
              <div className="empty-state-actions">
                <button type="button" className="btn btn-primary" onClick={() => openSearch(route.name!.replace(/-/g, ' '))}>
                  Search for “{route.name.replace(/-/g, ' ')}”
                </button>
                <Link to="/" className="btn">
                  Browse questions
                </Link>
              </div>
            </>
          ) : (
            <p className="muted">
              <Link to="/">Browse questions</Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  const unlocked = revealed || solved;
  const confirmReveal = () =>
    confirm({
      title: 'Reveal the solution?',
      body: <p>You'll see the reference solution and notes for this question. They unlock on their own once a submission is accepted.</p>,
      confirmLabel: 'Reveal',
      cancelLabel: 'Keep trying',
    });

  const reveal = async () => {
    if (await confirmReveal()) setRevealed(true);
  };

  const revealUiSolution = async () => {
    if (!(await confirmReveal())) return;
    setRevealed(true);
    setUiView('solution');
  };

  // No confirm: reset straight away and offer Undo, which puts the previous draft back.
  const resetUi = () => {
    const previous = loadDraft(draftId);
    clearDraft(draftId);
    loadQuestionFiles(question, 'starter', platform).then((files) => {
      setStarter(files);
      setResetKey((k) => k + 1);
      if (!previous) return;
      toast.show({
        message: 'Reset to the starter',
        action: {
          label: 'Undo',
          done: 'Restored your code',
          run: () => {
            const restored = applyDraft(files, previous);
            saveDraft(draftId, restored);
            setStarter(restored);
            setResetKey((k) => k + 1);
          },
        },
      });
    });
  };

  const backToAttempt = () => {
    // The attempt sandbox unmounted while the solution was shown; remount it from the latest draft.
    setStarter((prevFiles) => (prevFiles ? applyDraft(prevFiles, loadDraft(draftId)) : prevFiles));
    setUiView('attempt');
  };

  const workspacePanels = {
    filesOpen: layout.state.files,
    onFilesOpenChange: layout.setFiles,
    previewOpen: layout.state.preview,
    onConsoleErrors: setConsoleErrors,
  };

  const hasUiSolution = platform === 'native' ? question.hasNativeSolution : question.hasSolution;
  const changePlatform = (next: Platform) => navigate(questionUrl(question, next), { replace: true });

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
            {breadcrumbOf(question).map((g, i) => (
              <span key={g.id} className="breadcrumb-item">
                {i > 0 && <ChevronRight size={12} aria-hidden />}
                <Link to={groupUrl(g.id)}>{g.label}</Link>
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
          <LayoutToggles panels={panels} state={layout.state} onToggle={layout.toggle} previewAlert={consoleErrors > 0} />
          {question.type === 'react' && <PlatformToggle value={platform} onChange={changePlatform} />}
          <div className="btn-group" role="group" aria-label="Question navigation">
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!prev}
              onClick={() => prev && navigate(hrefOf(prev))}
              data-tooltip={prev ? `Previous: ${prev.title}` : 'No previous question'}
              data-tooltip-kbd={prev ? keysFor('prev') : undefined}
              aria-keyshortcuts={ariaKeysFor('prev')}
              aria-label="Previous question"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              className="icon-btn bordered"
              disabled={!next}
              onClick={() => next && navigate(hrefOf(next))}
              data-tooltip={next ? `Next: ${next.title}` : 'No next question'}
              data-tooltip-kbd={next ? keysFor('next') : undefined}
              aria-keyshortcuts={ariaKeysFor('next')}
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
                <MarkComplete slug={question.slug} />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={revealUiSolution}
                  disabled={!hasUiSolution}
                  data-tooltip={hasUiSolution ? undefined : `No ${platform === 'native' ? 'React Native ' : ''}reference solution has been written yet`}
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

      <div className="question-body" style={{ '--prompt-width': `${divider.value}px` } as CSSProperties}>
        {!layout.state.description && (
          <PromptStrip
            tabs={tabs}
            onOpen={(tab) => {
              setLeftTab(tab);
              layout.setDescription(true);
            }}
          />
        )}
        {layout.state.description && (
          <>
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
              aria-valuenow={divider.value}
              tabIndex={0}
              onPointerDown={divider.onPointerDown}
              onKeyDown={divider.onKeyDown}
              onDoubleClick={divider.reset}
            />
          </>
        )}

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
                    onFirstEdit={onFirstEdit}
                    {...workspacePanels}
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
                    {...workspacePanels}
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
