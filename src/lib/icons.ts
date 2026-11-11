import {
  Atom,
  BookOpen,
  Brain,
  Braces,
  FileCode2,
  House,
  ListChecks,
  Network,
  PanelsTopLeft,
  type LucideIcon,
} from 'lucide-react';

/** One icon per track / topic group, shared by the sidebar, peek menus, palette and dashboard. */
export const TRACK_ICONS: Record<string, LucideIcon> = {
  js: Braces,
  dsa: Network,
  'machine-coding': PanelsTopLeft,
  'machine-coding/react': Atom,
  'machine-coding/vanilla': FileCode2,
};

/** The app's sections, as they appear in the sidebar rail. */
export const SECTION_ICONS = {
  home: House,
  questions: ListChecks,
  quiz: Brain,
  notes: BookOpen,
} satisfies Record<string, LucideIcon>;

/** Icon for a question: its machine-coding flavour, else its track. */
export const questionIcon = (q: { track: string; type: string }): LucideIcon =>
  TRACK_ICONS[q.track === 'machine-coding' ? `machine-coding/${q.type}` : q.track] ?? Braces;
