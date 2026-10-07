import { useMemo } from 'react';
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import type { FileMap, Question } from '../../lib/content/catalog';
import DraftSaver from './DraftSaver';
import { useTheme } from '../../lib/theme';
import { sandpackThemes } from './sandpackThemes';

interface WorkspaceProps {
  question: Question;
  files: FileMap;
  readOnly?: boolean;
  /** When set, edits are saved as a draft under this question slug. */
  draftSlug?: string;
}

/** Live-preview sandbox for machine-coding (React / vanilla) questions. */
export default function Workspace({ question, files, readOnly = false, draftSlug }: WorkspaceProps) {
  const { resolved } = useTheme();
  const isReact = question.type === 'react';
  // Stable references: Sandpack re-initialises whenever these props change identity.
  const sandpackFiles = useMemo(
    () => Object.fromEntries(Object.entries(files).map(([path, code]) => [path, { code, readOnly }])),
    [files, readOnly],
  );
  const customSetup = useMemo(() => ({ dependencies: question.dependencies }), [question]);
  const options = useMemo(() => ({ activeFile: isReact ? '/App.js' : '/index.js', recompileDelay: 400 }), [isReact]);
  const draftPaths = useMemo(() => Object.keys(files), [files]);

  return (
    <SandpackProvider
      template={isReact ? 'react' : 'vanilla'}
      files={sandpackFiles}
      customSetup={customSetup}
      theme={sandpackThemes[resolved]}
      options={options}
    >
      {draftSlug && !readOnly && <DraftSaver slug={draftSlug} paths={draftPaths} />}
      <SandpackLayout className="workspace-layout">
        <SandpackCodeEditor
          className="workspace-editor"
          showTabs
          showLineNumbers
          showInlineErrors
          wrapContent
          closableTabs={false}
          readOnly={readOnly}
          showReadOnly={readOnly}
        />
        <div className="workspace-output">
          <SandpackPreview className="workspace-preview" showOpenInCodeSandbox={false} />
          <SandpackConsole className="workspace-console" showHeader resetOnPreviewRestart />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
}
