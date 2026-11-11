import { useMemo, useState } from 'react';
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from '@codesandbox/sandpack-react';
import { PanelLeftOpen } from 'lucide-react';
import type { FileMap, Question } from '../../lib/content/catalog';
import { useTheme } from '../../lib/theme';
import { usePersistentState } from '../../lib/usePersistentState';
import ConsoleDrawer from '../console/ConsoleDrawer';
import { useSandpackLogs } from '../console/useSandpackLogs';
import DraftSaver from './DraftSaver';
import FileExplorer from './explorer/FileExplorer';
import PreviewPane from './PreviewPane';
import { sandpackThemes } from './sandpackThemes';

type Kind = 'react' | 'vanilla';

// Sandpack template files that are plumbing rather than part of the exercise
// (unless a question ships its own copy). Vanilla keeps index.html visible: it's
// where the markup lives.
const TEMPLATE_INTERNALS: Record<Kind, string[]> = {
  react: ['/index.js', '/public/index.html', '/package.json'],
  vanilla: ['/package.json'],
};

/** Entry points the app can't run without; the first one is the default open file. */
const PROTECTED: Record<Kind, string[]> = {
  react: ['/App.js'],
  vanilla: ['/index.js', '/index.html'],
};

/** Below this width the file tree starts hidden so the editor keeps room. */
const EXPLORER_MIN_VIEWPORT = 1100;

interface WorkspaceProps {
  question: Question;
  files: FileMap;
  readOnly?: boolean;
  /** When set, edits are saved as a draft under this question slug. */
  draftSlug?: string;
}

function SandpackConsoleDrawer() {
  const { entries, clear } = useSandpackLogs();
  return <ConsoleDrawer entries={entries} onClear={clear} />;
}

/** Live-preview sandbox for machine-coding (React / vanilla) questions: files · editor · preview + console. */
export default function Workspace({ question, files, readOnly = false, draftSlug }: WorkspaceProps) {
  const { resolved } = useTheme();
  const kind: Kind = question.type === 'react' ? 'react' : 'vanilla';
  const [explorerOpen, setExplorerOpen] = usePersistentState(
    'fp:explorerOpen',
    typeof window === 'undefined' || window.innerWidth >= EXPLORER_MIN_VIEWPORT,
  );
  const [maximized, setMaximized] = useState(false);

  // Stable references: Sandpack re-initialises whenever these props change identity.
  const sandpackFiles = useMemo(
    () => Object.fromEntries(Object.entries(files).map(([path, code]) => [path, { code, readOnly }])),
    [files, readOnly],
  );
  const customSetup = useMemo(() => ({ dependencies: question.dependencies }), [question]);
  const options = useMemo(() => ({ activeFile: PROTECTED[kind][0], recompileDelay: 400 }), [kind]);
  const hidden = useMemo(() => TEMPLATE_INTERNALS[kind].filter((p) => !(p in files)), [kind, files]);

  return (
    <SandpackProvider
      template={kind}
      files={sandpackFiles}
      customSetup={customSetup}
      theme={sandpackThemes[resolved]}
      options={options}
    >
      {draftSlug && !readOnly && <DraftSaver slug={draftSlug} hidden={hidden} />}
      {/* SandpackLayout (not a plain div): it anchors Sandpack's lazy start, without which the
          preview's loading overlay never clears. */}
      <SandpackLayout className={`mc-workspace${maximized ? ' is-maximized' : ''}`}>
        {explorerOpen ? (
          <FileExplorer
            hidden={hidden}
            protectedPaths={PROTECTED[kind]}
            readOnly={readOnly}
            onCollapse={() => setExplorerOpen(false)}
          />
        ) : (
          <div className="explorer-rail">
            <button
              type="button"
              className="icon-btn"
              title="Show files"
              aria-label="Show files"
              onClick={() => setExplorerOpen(true)}
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>
        )}
        <div className="mc-editor">
          <SandpackCodeEditor
            className="workspace-editor"
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            closableTabs
            readOnly={readOnly}
            showReadOnly={readOnly}
          />
        </div>
        <div className="mc-output">
          <PreviewPane maximized={maximized} onToggleMaximize={() => setMaximized((m) => !m)} />
          <SandpackConsoleDrawer />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
}
