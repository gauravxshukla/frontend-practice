/** On phones the question page shows one view at a time; these are the views. */
export type PhonePane = 'problem' | 'code' | 'tests' | 'preview';

export const PANE_LABELS: Record<PhonePane, string> = {
  problem: 'Problem',
  code: 'Code',
  tests: 'Tests',
  preview: 'Preview',
};

/** Code questions run testcases; machine-coding questions render a live preview. */
export function phonePanes(isCode: boolean): PhonePane[] {
  return isCode ? ['problem', 'code', 'tests'] : ['problem', 'code', 'preview'];
}

export type PaneKey = 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

/** The tab a key moves to in the switcher (arrows wrap around, as in the ARIA tabs pattern). */
export function stepPane(panes: PhonePane[], current: PhonePane, key: PaneKey): PhonePane {
  if (key === 'Home') return panes[0];
  if (key === 'End') return panes[panes.length - 1];
  const i = Math.max(0, panes.indexOf(current));
  const delta = key === 'ArrowLeft' ? -1 : 1;
  return panes[(i + delta + panes.length) % panes.length];
}
