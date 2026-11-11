import { SandpackPreview, useSandpack, useSandpackNavigation } from '@codesandbox/sandpack-react';
import { ExternalLink, Maximize2, Minimize2, RotateCw, Smartphone } from 'lucide-react';
import { usePersistentState } from '../../lib/usePersistentState';
import DeviceFrame from './DeviceFrame';
import { snackUrl, type Platform } from './native/nativeSetup';

interface PreviewPaneProps {
  maximized: boolean;
  onToggleMaximize: () => void;
  platform: Platform;
  /** Files the user can see (React Native: what goes to Expo Snack). */
  isUserFile: (path: string) => boolean;
  title: string;
  dependencies: Record<string, string>;
}

/** Opens the current React Native files in Expo Snack, to try them on a real phone via Expo Go. */
function SnackLink({ isUserFile, title, dependencies }: Pick<PreviewPaneProps, 'isUserFile' | 'title' | 'dependencies'>) {
  const { sandpack } = useSandpack();
  const open = () => {
    const files = Object.fromEntries(
      Object.entries(sandpack.files)
        .filter(([path]) => isUserFile(path))
        .map(([path, file]) => [path, file.code]),
    );
    window.open(snackUrl(files, title, dependencies), '_blank', 'noopener,noreferrer');
  };
  return (
    <button
      type="button"
      className="icon-btn"
      title="Open in Expo Snack (snack.expo.dev) to run on a real device"
      aria-label="Open in Expo Snack"
      onClick={open}
    >
      <ExternalLink size={14} />
    </button>
  );
}

/** Live preview with a toolbar: reload, maximize, and for React Native a phone frame and Expo Snack. */
export default function PreviewPane({ maximized, onToggleMaximize, platform, isUserFile, title, dependencies }: PreviewPaneProps) {
  const { refresh } = useSandpackNavigation();
  const [framed, setFramed] = usePersistentState('fp:phoneFrame', true);
  const isNative = platform === 'native';
  const preview = <SandpackPreview className="workspace-preview" showOpenInCodeSandbox={false} showRefreshButton={false} />;

  return (
    <div className="preview-pane">
      <div className="pane-bar">
        <span className="pane-title">Preview</span>
        <div className="pane-actions">
          {isNative && (
            <>
              <button
                type="button"
                className="icon-btn"
                aria-pressed={framed}
                title={framed ? 'Fill the pane' : 'Show in a phone frame'}
                aria-label="Phone frame"
                onClick={() => setFramed((f) => !f)}
              >
                <Smartphone size={14} />
              </button>
              <SnackLink isUserFile={isUserFile} title={title} dependencies={dependencies} />
            </>
          )}
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
      {isNative && framed ? <DeviceFrame>{preview}</DeviceFrame> : preview}
    </div>
  );
}
