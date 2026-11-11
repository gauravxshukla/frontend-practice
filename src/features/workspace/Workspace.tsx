import { useMemo, useState, type CSSProperties } from 'react';
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from '@codesandbox/sandpack-react';
import { PanelLeftOpen } from 'lucide-react';
import type { FileMap, Question } from '../../lib/content/catalog';
import { useTheme } from '../../lib/theme';
import { useColumnResize } from '../../lib/useColumnResize';
import ConsoleDrawer from '../console/ConsoleDrawer';
import { useSandpackLogs } from '../console/useSandpackLogs';
import DraftSaver from './DraftSaver';
import FileExplorer from './explorer/FileExplorer';
import { nativeSetup, type Platform } from './native/nativeSetup';
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

// React Native replaces the template's entry with its own (see nativeSetup) and has no CSS files.
const NATIVE_TEMPLATE_INTERNALS = ['/public/index.html', '/package.json', '/styles.css'];

/** Entry points the app can't run without; the first one is the default open file. */
const PROTECTED: Record<Kind, string[]> = {
  react: ['/App.js'],
  vanilla: ['/index.js', '/index.html'],
};

interface WorkspaceProps {
  question: Question;
  files: FileMap;
  readOnly?: boolean;
  /** When set, edits are saved as a draft under this key. */
  draftSlug?: string;
  /** React questions: `native` runs the files through react-native-web. */
  platform?: Platform;
  /** Panel visibility is owned by the question page (its header has the toggles). */
  filesOpen: boolean;
  onFilesOpenChange: (open: boolean) => void;
  previewOpen: boolean;
  onConsoleErrors?: (errors: number) => void;
}

function SandpackConsoleDrawer({ onErrorCount }: { onErrorCount?: (errors: number) => void }) {
  const { entries, clear } = useSandpackLogs();
  return <ConsoleDrawer entries={entries} onClear={clear} onErrorCount={onErrorCount} />;
}

const SPLIT_LIMITS = { unit: 'fraction', min: 0.3, max: 0.7 } as const;

/** Live-preview sandbox for machine-coding (React / vanilla) questions: files · editor · preview + console. */
export default function Workspace({
  question,
  files,
  readOnly = false,
  draftSlug,
  platform = 'web',
  filesOpen,
  onFilesOpenChange,
  previewOpen,
  onConsoleErrors,
}: WorkspaceProps) {
  const { resolved } = useTheme();
  const kind: Kind = question.type === 'react' ? 'react' : 'vanilla';
  const [maximized, setMaximized] = useState(false);
  // Editor's share of the editor + preview area.
  const split = useColumnResize('fp:mcSplit', 0.5, SPLIT_LIMITS);

  const isNative = kind === 'react' && platform === 'native';

  // Stable references: Sandpack re-initialises whenever these props change identity.
  const setup = useMemo(() => {
    if (!isNative) {
      return {
        files,
        dependencies: question.dependencies,
        hidden: TEMPLATE_INTERNALS[kind].filter((p) => !(p in files)),
      };
    }
    const native = nativeSetup(files, question.dependencies);
    return { ...native, hidden: [...NATIVE_TEMPLATE_INTERNALS.filter((p) => !(p in files)), ...native.hidden] };
  }, [isNative, files, question.dependencies, kind]);
  const sandpackFiles = useMemo(() => {
    // `hidden` keeps plumbing (React Native's entry and shim) out of the editor's tabs.
    const plumbing = new Set(setup.hidden);
    return Object.fromEntries(
      Object.entries(setup.files).map(([path, code]) => [path, { code, readOnly, hidden: plumbing.has(path) }]),
    );
  }, [setup, readOnly]);
  const customSetup = useMemo(() => ({ dependencies: setup.dependencies }), [setup]);
  const options = useMemo(() => ({ activeFile: PROTECTED[kind][0], recompileDelay: 400 }), [kind]);
  const hidden = setup.hidden;
  const isUserFile = useMemo(() => {
    const skip = new Set(hidden);
    return (path: string) => !skip.has(path);
  }, [hidden]);

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
      <SandpackLayout className={`mc-workspace${maximized && previewOpen ? ' is-maximized' : ''}`}>
        {filesOpen ? (
          <FileExplorer
            hidden={hidden}
            protectedPaths={PROTECTED[kind]}
            readOnly={readOnly}
            onCollapse={() => onFilesOpenChange(false)}
          />
        ) : (
          <div className="explorer-rail">
            <button
              type="button"
              className="icon-btn"
              data-tooltip="Show files"
              aria-label="Show files"
              onClick={() => onFilesOpenChange(true)}
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>
        )}
        <div
          className={`mc-split${previewOpen ? '' : ' preview-hidden'}`}
          style={{ '--split': `${split.value * 100}%` } as CSSProperties}
        >
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
          {previewOpen && (
            <div
              className="resize-handle split-handle"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize editor and preview"
              aria-valuemin={30}
              aria-valuemax={70}
              aria-valuenow={Math.round(split.value * 100)}
              tabIndex={0}
              data-tooltip="Drag to resize · double-click to reset"
              onPointerDown={split.onPointerDown}
              onKeyDown={split.onKeyDown}
              onDoubleClick={split.reset}
            />
          )}
          {/* Hidden, not unmounted: the preview keeps running and the console keeps its logs. */}
          <div className="mc-output" hidden={!previewOpen}>
            <PreviewPane
              maximized={maximized}
              onToggleMaximize={() => setMaximized((m) => !m)}
              platform={isNative ? 'native' : 'web'}
              isUserFile={isUserFile}
              title={question.title}
              dependencies={question.dependencies}
            />
            <SandpackConsoleDrawer onErrorCount={onConsoleErrors} />
          </div>
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
}
