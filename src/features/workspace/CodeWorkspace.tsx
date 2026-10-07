import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { SandpackCodeEditor, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react';
import { CloudUpload, Play, RotateCcw } from 'lucide-react';
import type { Question, RunnerAssets } from '../../lib/content/catalog';
import { clearDraft, loadDraft } from '../../lib/drafts';
import { markAttempted, markSolved } from '../../lib/progress';
import { useTheme } from '../../lib/theme';
import { usePersistentState } from '../../lib/usePersistentState';
import { Kbd } from '../../components/Kbd';
import { runJob, type RunJob } from '../runner/runJob';
import { toVerdict, type Verdict } from '../runner/verdict';
import DraftSaver from './DraftSaver';
import ResultPanel from './ResultPanel';
import { DsaTestcasePanel, JsTestcasePanel, toEditable, toRunnable, type EditableCase } from './TestcasePanel';
import { sandpackThemes } from './sandpackThemes';

const FILE = '/solution.js';
const LIMIT_MS = { dsa: 3000, jest: 6000 };
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

interface Props {
  question: Question;
  assets: RunnerAssets;
  onAccepted: () => void;
}

/** Tests a Run executes for JS questions: ones named "example…", else the first two. */
function exampleTests(names: string[]) {
  const examples = names.filter((n) => /(^|› )example/i.test(n));
  return examples.length ? examples : names.slice(0, 2);
}

function useConsoleResize() {
  const [height, setHeight] = usePersistentState('fp:consoleHeight', 280);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    document.body.classList.add('is-resizing-rows');
    const onMove = (ev: PointerEvent) =>
      setHeight(Math.round(Math.min(Math.max(container.bottom - ev.clientY, 120), container.height - 120)));
    const onUp = () => {
      document.body.classList.remove('is-resizing-rows');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  return { height, onPointerDown };
}

function Inner({ question, assets, onAccepted, onResetCode }: Props & { onResetCode: () => void }) {
  const { sandpack } = useSandpack();
  const codeRef = useRef('');
  codeRef.current = sandpack.files[FILE]?.code ?? '';

  const spec = assets.spec;
  const initialCases = useMemo(
    () => (spec ? spec.cases.filter((c) => !c.hidden).map((c) => toEditable(spec, c)) : []),
    [spec],
  );
  const [cases, setCases] = useState<EditableCase[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState(0);
  const [caseError, setCaseError] = useState<string>();
  const [testNames, setTestNames] = useState<string[]>([]);

  const [tab, setTab] = useState<'testcase' | 'result'>('testcase');
  const [running, setRunning] = useState<'run' | 'submit' | null>(null);
  const [lastMode, setLastMode] = useState<'run' | 'submit'>('run');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const consoleResize = useConsoleResize();

  // JS questions: learn the suite's test names (registering tests doesn't run them).
  useEffect(() => {
    if (!assets.tests) return;
    runJob({ type: 'jest-collect', userCode: assets.starter, testCode: assets.tests }, 5000).then((res) => {
      if (res.type === 'collected') setTestNames(res.names);
    });
  }, [assets]);

  const execute = useCallback(
    async (mode: 'run' | 'submit') => {
      if (running) return;
      let job: RunJob;
      if (spec) {
        let runnable;
        try {
          runnable = mode === 'run' ? cases.map((c) => toRunnable(spec, c)) : spec.cases;
          setCaseError(undefined);
        } catch (e) {
          setCaseError((e as Error).message);
          setTab('testcase');
          return;
        }
        job = { type: 'dsa', userCode: codeRef.current, refCode: assets.solution, checkerCode: assets.checker, spec, cases: runnable };
      } else if (assets.tests) {
        job = {
          type: 'jest',
          userCode: codeRef.current,
          testCode: assets.tests,
          only: mode === 'run' && testNames.length ? exampleTests(testNames) : undefined,
        };
      } else {
        return;
      }

      setRunning(mode);
      setLastMode(mode);
      setTab('result');
      const response = await runJob(job, spec ? LIMIT_MS.dsa : LIMIT_MS.jest);
      const next = toVerdict(response);
      setVerdict(next);
      setRunning(null);

      if (mode === 'submit' && next.kind === 'accepted') {
        markSolved(question.slug);
        onAccepted();
      } else {
        markAttempted(question.slug);
      }
    },
    [running, spec, cases, assets, testNames, question.slug, onAccepted],
  );

  // ⌘' / Ctrl+' runs, ⌘↵ / Ctrl+↵ submits. Capture phase so the editor doesn't eat them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "'") {
        e.preventDefault();
        e.stopPropagation();
        execute('run');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        execute('submit');
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [execute]);

  const mod = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="code-workspace">
      <div className="editor-bar">
        <span className="editor-lang">JavaScript</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onResetCode}
          title="Discard your code and restore the starter"
        >
          <RotateCcw size={13} aria-hidden /> Reset code
        </button>
      </div>

      <div className="editor-area">
        <SandpackCodeEditor className="code-editor" showLineNumbers showTabs={false} wrapContent showInlineErrors={false} />
      </div>

      <div className="row-resize" role="separator" aria-orientation="horizontal" aria-label="Resize console" onPointerDown={consoleResize.onPointerDown} />

      <section className="console" style={{ height: consoleResize.height }} aria-label="Console">
        <div className="console-header">
          <div className="console-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'testcase'} onClick={() => setTab('testcase')}>
              Testcase
            </button>
            <button type="button" role="tab" aria-selected={tab === 'result'} onClick={() => setTab('result')}>
              Test Result
              {verdict && !running && <span className={`tab-dot verdict-${verdict.kind}`} aria-hidden />}
            </button>
          </div>
          <div className="console-actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => execute('run')}
              disabled={running !== null}
              title={`Run the visible testcases (${mod}')`}
            >
              <Play size={13} aria-hidden /> Run <Kbd>{`${mod}'`}</Kbd>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-submit"
              onClick={() => execute('submit')}
              disabled={running !== null}
              title={`Judge against every testcase, including hidden ones (${mod}↵)`}
            >
              <CloudUpload size={13} aria-hidden /> Submit <Kbd>{`${mod}↵`}</Kbd>
            </button>
          </div>
        </div>

        <div className="console-body">
          {tab === 'testcase' ? (
            spec ? (
              <DsaTestcasePanel
                spec={spec}
                cases={cases}
                selected={Math.min(selectedCase, cases.length - 1)}
                onSelect={setSelectedCase}
                onChange={setCases}
                onReset={() => {
                  setCases(initialCases);
                  setSelectedCase(0);
                  setCaseError(undefined);
                }}
                error={caseError}
              />
            ) : (
              <JsTestcasePanel runNames={exampleTests(testNames)} total={testNames.length} />
            )
          ) : (
            <ResultPanel mode={running ?? lastMode} verdict={verdict} running={running !== null} />
          )}
        </div>
      </section>

      <DraftSaver slug={question.slug} paths={[FILE]} />
    </div>
  );
}

/** LeetCode-style editor + Run/Submit console for JS and DSA questions. */
export default function CodeWorkspace({ question, assets, onAccepted }: Props) {
  const { resolved } = useTheme();
  // Bumping this remounts the editor, which is how "Reset code" discards edits.
  const [resetKey, setResetKey] = useState(0);
  const initialCode = useMemo(
    () => loadDraft(question.slug)?.[FILE] ?? assets.starter,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.slug, assets.starter, resetKey],
  );
  // Stable references: Sandpack re-initialises its files whenever these props change identity,
  // which would wipe the editor on any parent re-render (e.g. after an Accepted submit).
  const files = useMemo(() => ({ [FILE]: initialCode }), [initialCode]);
  const options = useMemo(() => ({ activeFile: FILE, visibleFiles: [FILE] }), []);

  return (
    <SandpackProvider
      key={`${question.slug}:${resetKey}`}
      files={files}
      theme={sandpackThemes[resolved]}
      options={options}
    >
      <Inner
        question={question}
        assets={assets}
        onAccepted={onAccepted}
        onResetCode={() => {
          if (!window.confirm('Discard your code and restore the starter?')) return;
          clearDraft(question.slug);
          setResetKey((k) => k + 1);
        }}
      />
    </SandpackProvider>
  );
}
