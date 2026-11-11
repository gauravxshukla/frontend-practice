import { useEffect, useRef } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';

/**
 * Calls `onFirstEdit` once, the first time the sandbox's files differ from what
 * they were when it mounted (opening a question isn't practice; typing is).
 */
export default function EditTracker({ onFirstEdit }: { onFirstEdit: () => void }) {
  const { sandpack } = useSandpack();
  const initial = useRef<string | null>(null);
  const fired = useRef(false);
  const snapshot = JSON.stringify(Object.entries(sandpack.files).map(([path, f]) => [path, f.code]));

  useEffect(() => {
    if (initial.current === null) {
      initial.current = snapshot;
      return;
    }
    if (!fired.current && snapshot !== initial.current) {
      fired.current = true;
      onFirstEdit();
    }
  }, [snapshot, onFirstEdit]);

  return null;
}
