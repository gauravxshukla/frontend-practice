import { useCallback, useEffect } from 'react';
import { usePersistentState } from '../../lib/usePersistentState';

export type PanelId = 'description' | 'files' | 'preview';

/** Below this width the file tree starts hidden so the editor keeps room. */
const FILES_MIN_VIEWPORT = 1100;
const MAX_TABS_WITHOUT_TREE = 3;

/**
 * Whether the file tree should start open: only when it helps, i.e. more files
 * than a few editor tabs show comfortably, or any folder.
 */
export function filesOpenByDefault(paths: string[]): boolean {
  return paths.length > MAX_TABS_WITHOUT_TREE || paths.some((p) => p.split('/').filter(Boolean).length > 1);
}

const SHORTCUT_PANELS: Record<string, PanelId> = { Digit1: 'description', Digit2: 'files', Digit3: 'preview' };

/**
 * Which question-page panels are showing, remembered across questions. The file
 * tree follows `filesOpenByDefault` until the user picks a side; after that their
 * choice sticks. Alt+1/2/3 toggle description / files / preview.
 */
export function useWorkspaceLayout({ panels, paths }: { panels: PanelId[]; paths: string[] }) {
  const [description, setDescription] = usePersistentState('fp:layout:prompt', true);
  const [filesChoice, setFilesChoice] = usePersistentState<boolean | null>('fp:explorerOpen', null);
  const [preview, setPreview] = usePersistentState('fp:layout:preview', true);

  const wide = typeof window === 'undefined' || window.innerWidth >= FILES_MIN_VIEWPORT;
  const files = filesChoice ?? (wide && filesOpenByDefault(paths));
  const state: Record<PanelId, boolean> = { description, files, preview };

  const toggle = useCallback(
    (panel: PanelId) => {
      if (panel === 'description') setDescription((v) => !v);
      else if (panel === 'files') setFilesChoice(!files);
      else setPreview((v) => !v);
    },
    [files, setDescription, setFilesChoice, setPreview],
  );

  // Alt+1/2/3, matched on the physical key: on a Mac, Option+1 types "¡".
  const panelKey = panels.join();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const panel = SHORTCUT_PANELS[e.code];
      if (!panel || !panelKey.split(',').includes(panel) || document.querySelector('dialog[open]')) return;
      e.preventDefault();
      e.stopPropagation();
      toggle(panel);
    };
    // Capture phase, so it works inside the code editor too.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [panelKey, toggle]);

  return {
    state,
    toggle,
    setDescription,
    setFiles: (open: boolean) => setFilesChoice(open),
  };
}
