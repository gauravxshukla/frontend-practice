import { SandpackPreview, useSandpackNavigation } from '@codesandbox/sandpack-react';
import { Maximize2, Minimize2, RotateCw } from 'lucide-react';

interface PreviewPaneProps {
  maximized: boolean;
  onToggleMaximize: () => void;
}

/** Live preview with a toolbar: reload, and maximize to give preview + console the whole workspace. */
export default function PreviewPane({ maximized, onToggleMaximize }: PreviewPaneProps) {
  const { refresh } = useSandpackNavigation();
  return (
    <div className="preview-pane">
      <div className="pane-bar">
        <span className="pane-title">Preview</span>
        <div className="pane-actions">
          <button type="button" className="icon-btn" title="Reload preview" aria-label="Reload preview" onClick={refresh}>
            <RotateCw size={14} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-pressed={maximized}
            title={maximized ? 'Restore layout' : 'Maximize preview and console'}
            aria-label={maximized ? 'Restore layout' : 'Maximize preview and console'}
            onClick={onToggleMaximize}
          >
            {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      <SandpackPreview className="workspace-preview" showOpenInCodeSandbox={false} showRefreshButton={false} />
    </div>
  );
}
