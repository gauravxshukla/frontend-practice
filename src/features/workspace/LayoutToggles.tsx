import { FolderTree, PanelLeft, PanelRight, type LucideIcon } from 'lucide-react';
import { ariaKeysFor, keysFor } from '../../lib/shortcuts';
import type { PanelId } from './useWorkspaceLayout';

const PANELS: Record<PanelId, { label: string; icon: LucideIcon }> = {
  description: { label: 'Description', icon: PanelLeft },
  files: { label: 'Files', icon: FolderTree },
  preview: { label: 'Preview and console', icon: PanelRight },
};

interface Props {
  panels: PanelId[];
  state: Record<PanelId, boolean>;
  onToggle: (panel: PanelId) => void;
  /** The preview is hidden and the console has errors: show a dot on its toggle. */
  previewAlert?: boolean;
}

/** Show / hide the question page's panels, like an editor's layout controls. */
export default function LayoutToggles({ panels, state, onToggle, previewAlert = false }: Props) {
  return (
    <div className="layout-toggles" role="group" aria-label="Panels">
      {panels.map((id) => {
        const { label, icon: Icon } = PANELS[id];
        const on = state[id];
        const alert = id === 'preview' && !on && previewAlert;
        return (
          <button
            key={id}
            type="button"
            className={`icon-btn layout-toggle${on ? ' on' : ''}`}
            aria-pressed={on}
            aria-label={alert ? `${label} (console has errors)` : label}
            aria-keyshortcuts={ariaKeysFor(id)}
            data-tooltip={`${on ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
            data-tooltip-kbd={keysFor(id)}
            onClick={() => onToggle(id)}
          >
            <Icon size={16} aria-hidden />
            {alert && <span className="layout-toggle-dot" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
