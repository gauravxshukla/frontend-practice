import { Loader2, TriangleAlert } from 'lucide-react';
import type { RuntimeStatus as Status } from '../runner/languages/types';

interface RuntimeStatusProps {
  label: string;
  status: Status;
  /** One-time download size, e.g. "~6 MB". */
  download?: string;
  error?: string;
  onRetry: () => void;
}

/** Inline status of a language runtime that loads on demand; nothing once it's ready. */
export default function RuntimeStatus({ label, status, download, error, onRetry }: RuntimeStatusProps) {
  if (status === 'loading' || status === 'restarting') {
    return (
      <span className="runtime-status" role="status">
        <Loader2 size={13} className="spin" aria-hidden />
        {status === 'loading'
          ? `Preparing ${label} runtime…${download ? ` (one-time ${download} download)` : ''}`
          : `Restarting ${label}…`}
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="runtime-status tone-bad" role="alert" title={error}>
        <TriangleAlert size={13} aria-hidden />
        Couldn’t load the {label} runtime. Are you offline?
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
          Retry
        </button>
      </span>
    );
  }
  return null;
}
