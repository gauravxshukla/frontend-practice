import { useEffect } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { saveDraft } from '../../lib/drafts';

type DraftSaverProps =
  /** Save exactly these files (single-file code questions). */
  | { slug: string; paths: string[]; hidden?: never }
  /** Save every file except template internals, so files created, renamed or deleted in the explorer persist. */
  | { slug: string; hidden: string[]; paths?: never };

/** Persists the sandbox's files as a draft for `slug` (debounced). */
export default function DraftSaver({ slug, paths, hidden }: DraftSaverProps) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    const id = setTimeout(() => {
      const keep = paths
        ? paths.filter((p) => sandpack.files[p])
        : Object.keys(sandpack.files).filter((p) => !hidden.includes(p) && !sandpack.files[p].hidden);
      saveDraft(slug, Object.fromEntries(keep.map((p) => [p, sandpack.files[p].code])));
    }, 400);
    return () => clearTimeout(id);
  }, [sandpack.files, slug, paths, hidden]);

  return null;
}
