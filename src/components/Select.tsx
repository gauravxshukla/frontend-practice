import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * A native <select> (keyboard and screen-reader behaviour for free) with our own
 * chevron. Its right padding is reserved for the chevron, so the text ellipsises
 * before it rather than running underneath it at narrow widths.
 */
export function Select({
  className = '',
  icon,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  /** Shown instead of the text where a stylesheet collapses the select to an icon (see console.css). */
  icon?: ReactNode;
}) {
  return (
    <span className={`select ${className}`}>
      <select {...props}>{children}</select>
      {icon && (
        <span className="select-icon" aria-hidden>
          {icon}
        </span>
      )}
      <ChevronDown size={14} className="select-chevron" aria-hidden />
    </span>
  );
}
