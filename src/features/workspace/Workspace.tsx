import { useEffect } from 'react';
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react';
import type { FileMap, Question } from '../../lib/content/catalog';
import { saveDraft } from '../../lib/drafts';
import { useTheme } from '../../lib/theme';
import { sandpackThemes } from './sandpackThemes';

interface WorkspaceProps {
  question: Question;
  files: FileMap;
  readOnly?: boolean;
  /** When set, edits are saved as a draft under this question slug. */
  draftSlug?: string;
}

const EDITABLE_EXCLUDES = ['/solution.test.js'];

function DraftSaver({ slug, paths }: { slug: string; paths: string[] }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    const id = setTimeout(() => {
      const draft = Object.fromEntries(
        paths.filter((p) => sandpack.files[p]).map((p) => [p, sandpack.files[p].code]),
      );
      saveDraft(slug, draft);
    }, 400);
    return () => clearTimeout(id);
  }, [sandpack.files, slug, paths]);

  return null;
}

function sandpackSetup(question: Question, files: FileMap, readOnly: boolean) {
  const sandpackFiles = Object.fromEntries(
    Object.entries(files).map(([path, code]) => [
      path,
      { code, readOnly: readOnly || EDITABLE_EXCLUDES.includes(path) },
    ]),
  );

  switch (question.type) {
    case 'react':
      return {
        template: 'react' as const,
        files: sandpackFiles,
        customSetup: { dependencies: question.dependencies },
        activeFile: '/App.js',
      };
    case 'vanilla':
      return {
        template: 'vanilla' as const,
        files: sandpackFiles,
        customSetup: { dependencies: question.dependencies },
        activeFile: '/index.js',
      };
    default:
      // No template: the same bare setup Sandpack's test template uses, minus its sample files.
      return {
        template: undefined,
        files: sandpackFiles,
        customSetup: { environment: 'parcel' as const, entry: '/solution.js' },
        activeFile: '/solution.js',
      };
  }
}

export default function Workspace({ question, files, readOnly = false, draftSlug }: WorkspaceProps) {
  const { template, files: sandpackFiles, customSetup, activeFile } = sandpackSetup(question, files, readOnly);
  const isUI = question.type === 'react' || question.type === 'vanilla';
  const draftPaths = Object.keys(files).filter((p) => !EDITABLE_EXCLUDES.includes(p));
  const { resolved } = useTheme();

  return (
    <SandpackProvider
      template={template}
      files={sandpackFiles}
      customSetup={customSetup}
      theme={sandpackThemes[resolved]}
      options={{ activeFile, recompileDelay: 400 }}
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
        {isUI ? (
          <div className="workspace-output">
            <SandpackPreview className="workspace-preview" showOpenInCodeSandbox={false} />
            <SandpackConsole className="workspace-console" showHeader resetOnPreviewRestart />
          </div>
        ) : (
          // Attempts run on demand (▶ or the Watch toggle) so half-typed code isn't graded;
          // the reference solution runs straight away.
          <SandpackTests className="workspace-tests" verbose watchMode={readOnly} />
        )}
      </SandpackLayout>
    </SandpackProvider>
  );
}
