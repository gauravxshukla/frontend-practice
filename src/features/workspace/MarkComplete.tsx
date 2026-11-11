import { Check, CircleCheckBig } from 'lucide-react';
import { useToast } from '../../components/overlay/ToastProvider';
import { recordActivity } from '../../lib/activity';
import { markSolved, markUnsolved, useProgress } from '../../lib/progress';

/** Machine-coding questions aren't graded, so you mark them complete yourself (undoable). */
export default function MarkComplete({ slug }: { slug: string }) {
  const done = useProgress()[slug] === 'solved';
  const toast = useToast();

  const toggle = () => {
    if (!done) {
      markSolved(slug);
      recordActivity(slug);
      toast.show({ message: 'Marked complete', action: { label: 'Undo', run: () => markUnsolved(slug) } });
      return;
    }
    markUnsolved(slug);
    toast.show({ message: 'Marked not complete', action: { label: 'Undo', run: () => markSolved(slug) } });
  };

  return (
    <button
      type="button"
      className={`btn${done ? ' btn-complete' : ''}`}
      aria-pressed={done}
      onClick={toggle}
      data-tooltip={done ? 'Completed · click to undo' : 'Count this question as solved'}
    >
      {done ? <CircleCheckBig size={14} aria-hidden /> : <Check size={14} aria-hidden />}
      {done ? 'Completed' : 'Mark complete'}
    </button>
  );
}
