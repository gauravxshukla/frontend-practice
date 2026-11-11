import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import { questionsIn, questionTree, type QuestionGroup } from '../lib/content/catalog';
import { noteSections } from '../lib/content/notes';
import { quizDecks } from '../lib/content/quiz';
import { placeFloating } from '../lib/floating';
import { useProgress } from '../lib/progress';

export type SectionId = 'questions' | 'quiz' | 'notes';

interface PeekProps {
  id: string;
  section: SectionId;
  label: string;
  anchor: HTMLElement;
  /** Same ids as the sidebar's `locate()`: `topic:dsa/trees`, `quiz:react`, `notes:<section>`. */
  activeLeaf?: string;
  /** Move focus to the first link once shown (opened from the keyboard). */
  focusFirst: boolean;
  onClose: (focusAnchor: boolean) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  groupIcons: Record<string, LucideIcon>;
}

function PeekLink({ to, active, depth = 0, icon: Icon, children, meta }: {
  to: string;
  active: boolean;
  depth?: number;
  icon?: LucideIcon;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <Link to={to} className={`peek-link depth-${depth}${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
      {Icon && <Icon size={14} className="nav-icon" aria-hidden />}
      <span className="peek-link-label">{children}</span>
      {meta}
    </Link>
  );
}

/**
 * The collapsed rail's flyout: a section's contents (tracks and topics with
 * progress, quiz decks, note sections) to jump to without expanding the sidebar.
 */
export default function SidebarPeek({
  id,
  section,
  label,
  anchor,
  activeLeaf,
  focusFirst,
  onClose,
  onPointerEnter,
  onPointerLeave,
  groupIcons,
}: PeekProps) {
  const ref = useRef<HTMLElement>(null);
  const progress = useProgress();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const place = () => {
      const { x, y } = placeFloating(anchor.getBoundingClientRect(), node.getBoundingClientRect(), 'right', {
        width: window.innerWidth,
        height: window.innerHeight,
      }, 10, 'start');
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [anchor, section]);

  useLayoutEffect(() => {
    if (focusFirst) ref.current?.querySelector<HTMLElement>('a')?.focus();
  }, [focusFirst, section]);

  const solvedCount = (g: QuestionGroup) => {
    const items = questionsIn(g);
    const solved = items.filter((q) => progress[q.slug] === 'solved').length;
    return (
      <span className="nav-count" aria-label={`${solved} of ${items.length} solved`}>
        {solved}/{items.length}
      </span>
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const links = Array.from(ref.current?.querySelectorAll<HTMLElement>('a') ?? []);
    const at = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      links[(at + step + links.length) % links.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      links[e.key === 'Home' ? 0 : links.length - 1]?.focus();
    } else if (e.key === 'Escape' || e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      onClose(true);
    }
  };

  return (
    <nav
      ref={ref}
      id={id}
      className="sidebar-peek"
      aria-label={label}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        // Tabbing out of the menu (and not back to its button) closes it.
        const next = e.relatedTarget as Node | null;
        if (next && !e.currentTarget.contains(next) && next !== anchor) onClose(false);
      }}
      // Following a link closes the menu.
      onClick={(e) => (e.target as Element).closest('a') && onClose(false)}
    >
      <div className="peek-header">{label}</div>
      <div className="peek-body">
        {section === 'questions' &&
          questionTree.map((track) => (
            <div key={track.id} className="peek-group">
              <PeekLink
                to={`/topics/${track.id}`}
                active={activeLeaf === `topic:${track.id}`}
                icon={groupIcons[track.id]}
                meta={solvedCount(track)}
              >
                {track.label}
              </PeekLink>
              {track.children.map((topic) => (
                <PeekLink
                  key={topic.id}
                  to={`/topics/${topic.id}`}
                  depth={1}
                  active={activeLeaf === `topic:${topic.id}`}
                  icon={groupIcons[topic.id]}
                  meta={solvedCount(topic)}
                >
                  {topic.label}
                </PeekLink>
              ))}
            </div>
          ))}
        {section === 'quiz' && (
          <>
            <PeekLink to="/quiz" active={false}>
              All decks
            </PeekLink>
            {quizDecks.map((deck) => (
              <PeekLink
                key={deck.slug}
                to={`/quiz/${deck.slug}`}
                depth={1}
                active={activeLeaf === `quiz:${deck.slug}`}
                meta={<span className="nav-count">{deck.cards.length}</span>}
              >
                {deck.title}
              </PeekLink>
            ))}
          </>
        )}
        {section === 'notes' && (
          <>
            <PeekLink to="/notes" active={false}>
              All notes
            </PeekLink>
            {noteSections.map((s) => (
              <PeekLink
                key={s.id}
                to={`/notes/${s.id}`}
                depth={1}
                active={activeLeaf === `notes:${s.id}`}
                meta={<span className="nav-count">{s.notes.length}</span>}
              >
                {s.label}
              </PeekLink>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
