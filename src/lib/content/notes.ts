export interface Note {
  /** Path under /content/notes without extension, e.g. `system-design/performance/bundle`. */
  slug: string;
  title: string;
  section: string;
  /** Folder path of the section, e.g. `system-design/performance`; the sidebar links to it. */
  sectionId: string;
  content: string;
}

// Notes are small, so they're bundled eagerly; that also lets empty stubs be hidden.
const files = import.meta.glob('/content/notes/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** `cssPerf` / `system-design` → `Css perf` / `System design`. */
function humanize(segment: string) {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

const ACRONYMS: Record<string, string> = { Css: 'CSS', Dom: 'DOM', Javascript: 'JavaScript' };

function label(segment: string) {
  return humanize(segment).replace(/\b(Css|Dom|Javascript)\b/g, (w) => ACRONYMS[w]);
}

export const notes: Note[] = Object.entries(files)
  .filter(([, content]) => content.trim())
  .map(([path, content]) => {
    const slug = path.replace('/content/notes/', '').replace(/\.md$/, '');
    const parts = slug.split('/');
    return {
      slug,
      title: label(parts[parts.length - 1]),
      section: parts.length > 1 ? parts.slice(0, -1).map(label).join(' › ') : 'General',
      sectionId: parts.length > 1 ? parts.slice(0, -1).join('/') : 'general',
      content,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function getNote(slug: string) {
  return notes.find((n) => n.slug === slug);
}

export interface NoteSection {
  id: string;
  label: string;
  notes: Note[];
}

export const noteSections: NoteSection[] = [...new Set(notes.map((n) => n.sectionId))].map((id) => {
  const items = notes.filter((n) => n.sectionId === id);
  return { id, label: items[0].section, notes: items };
});

export function getNoteSection(id: string) {
  return noteSections.find((s) => s.id === id);
}
