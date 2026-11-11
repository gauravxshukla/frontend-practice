import { BookOpen, Code2, FileText, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { description: FileText, notes: BookOpen, solution: Code2 };

interface Props<T extends string> {
  tabs: { id: T; label: string }[];
  onOpen: (tab: T) => void;
}

/** What's left of the problem panel when it's hidden: one button per tab, which reopens it there. */
export default function PromptStrip<T extends string>({ tabs, onOpen }: Props<T>) {
  return (
    <nav className="prompt-strip" aria-label="Problem (hidden)">
      {tabs.map((t) => {
        const Icon = ICONS[t.id] ?? FileText;
        return (
          <button
            key={t.id}
            type="button"
            className="icon-btn"
            aria-label={`Show ${t.label.toLowerCase()}`}
            data-tooltip={`Show ${t.label.toLowerCase()}`}
            data-tooltip-side="right"
            onClick={() => onOpen(t.id)}
          >
            <Icon size={16} aria-hidden />
          </button>
        );
      })}
    </nav>
  );
}
