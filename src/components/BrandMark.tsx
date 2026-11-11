import { useId } from 'react';

// "F." outlined from Inter ExtraBold (800, OFL), tracking −0.04em, centred in the
// 32×32 tile. Outlines rather than text, so the mark needs no font load and the
// favicon in index.html (the same paths) looks identical.
const F_LETTER =
  'M11.60 23.75L7.93 23.75L7.93 8.25L18.47 8.25L18.47 11.25L11.60 11.25L11.60 15.18L17.79 15.18L17.79 18.11L11.60 18.11L11.60 23.75Z';
const F_DOT =
  'M22.10 23.97Q21.27 23.97 20.70 23.41Q20.14 22.86 20.14 22.03Q20.14 21.20 20.70 20.64Q21.27 20.09 22.10 20.09Q22.93 20.09 23.50 20.64Q24.07 21.20 24.07 22.03Q24.07 22.86 23.50 23.41Q22.93 23.97 22.10 23.97Z';

/**
 * The app's mark: "F." on a gradient tile. Colours come from the --brand-*
 * tokens, so it follows the theme.
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
      <path d={F_LETTER} style={{ fill: 'var(--brand-ink)' }} />
      <path d={F_DOT} style={{ fill: 'var(--brand-dot)' }} />
    </svg>
  );
}
