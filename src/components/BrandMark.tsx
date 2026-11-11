import { useId } from 'react';

/**
 * The app's mark: an angle-bracket glyph on a gradient tile. Colours come from
 * the --brand-* tokens, so it follows the theme. The favicon in index.html is
 * the same drawing.
 */
export function BrandMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  const gradient = useId();
  return (
    <svg className={`brand-mark ${className}`} width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--brand-from)' }} />
          <stop offset="1" style={{ stopColor: 'var(--brand-to)' }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradient})`} />
      <path
        d="M11.5 11 6.5 16l5 5M20.5 11l5 5-5 5M17.6 8.5l-3.2 15"
        fill="none"
        style={{ stroke: 'var(--brand-ink)' }}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
