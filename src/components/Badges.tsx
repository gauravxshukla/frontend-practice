import type { Difficulty } from '../lib/content/catalog';

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`pill pill-${difficulty}`}>{difficulty}</span>;
}

export function Tag({ children }: { children: string }) {
  return <span className="tag">{children}</span>;
}
