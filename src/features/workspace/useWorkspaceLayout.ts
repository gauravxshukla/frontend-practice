import { useCallback, useEffect } from 'react';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { usePersistentState } from '../../lib/usePersistentState';

export type PanelId = 'description' | 'files' | 'preview';

/** Narrower than this, the file tree starts hidden so the editor keeps room. */
export const FILES_WIDE_QUERY = '(min-width: 1100px)';
const MAX_TABS_WITHOUT_TREE = 3;

/**
 * Whether the file tree should start open: only when it helps, i.e. more files
 * than a few editor tabs show comfortably, or any folder.
 */
export function filesOpenByDefault(paths: string[]): boolean {
  return paths.length > MAX_TABS_WITHOUT_TREE || paths.some((p) => p.split('/').filter(Boolean).length > 1);
}

/** The user's stored choice wins; otherwise open only on a wide window and when the tree helps. */
export function resolveFilesOpen(choice: boolean | null, wide: boolean, paths: string[]): boolean {
  return choice ?? (wide && filesOpenByDefault(paths));
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

  // Live: resizing the window across the breakpoint updates the default.
  const wide = useMediaQuery(FILES_WIDE_QUERY);
  const files = resolveFilesOpen(filesChoice, wide, paths);
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
