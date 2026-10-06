import { parseFrontmatter } from './frontmatter.js';

export type QuestionType = 'js' | 'dsa' | 'react' | 'vanilla';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Track = 'js' | 'dsa' | 'machine-coding';

export interface Question {
  /** Folder path under /content, e.g. `js/promise-all` or `machine-coding/react/data-table`. */
  slug: string;
  track: Track;
  type: QuestionType;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes?: number;
  /** Extra npm deps for machine-coding sandboxes. */
  dependencies: Record<string, string>;
  prompt: string;
  /** The README's `## Notes` section, shown only after revealing the solution. */
  notes: string;
  hasSolution: boolean;
}

/** Sandpack file map: `/App.js` → source. */
export type FileMap = Record<string, string>;

export const TRACK_LABELS: Record<Track, string> = {
  js: 'JavaScript',
  dsa: 'DSA',
  'machine-coding': 'Machine coding',
};

// READMEs are eager (they're small and power the catalog). Everything else,
// solutions in particular, is fetched only when a question is opened.
const readmes = import.meta.glob('/content/{js,dsa,machine-coding}/**/README.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const files = import.meta.glob(
  ['/content/{js,dsa,machine-coding}/**/*', '!/content/**/README.md'],
  { query: '?raw', import: 'default' },
) as Record<string, () => Promise<string>>;

const filePaths = Object.keys(files);

function splitNotes(body: string): { prompt: string; notes: string } {
  const match = /^## Notes\s*$/m.exec(body);
  if (!match) return { prompt: body.trim(), notes: '' };
  return {
    prompt: body.slice(0, match.index).trim(),
    notes: body.slice(match.index + match[0].length).trim(),
  };
}

function folderOf(slug: string) {
  return `/content/${slug}`;
}

function buildQuestion(readmePath: string, raw: string): Question {
  const slug = readmePath.replace('/content/', '').replace('/README.md', '');
  const { data, body } = parseFrontmatter(raw);
  const { prompt, notes } = splitNotes(body);
  const folder = folderOf(slug);
  const type = data.type as QuestionType;
  const isUI = type === 'react' || type === 'vanilla';

  return {
    slug,
    track: slug.split('/')[0] as Track,
    type,
    title: data.title ?? slug,
    difficulty: data.difficulty ?? 'medium',
    tags: data.tags ?? [],
    estimatedMinutes: data.estimatedMinutes,
    dependencies: Object.fromEntries(
      ((data.dependencies as string[] | undefined) ?? []).map((dep) => {
        const at = dep.lastIndexOf('@');
        return at > 0 ? [dep.slice(0, at), dep.slice(at + 1)] : [dep, 'latest'];
      }),
    ),
    prompt,
    notes,
    hasSolution: isUI
      ? filePaths.some((p) => p.startsWith(`${folder}/solution/`))
      : filePaths.includes(`${folder}/solution.js`),
  };
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

export const questions: Question[] = Object.entries(readmes)
  .map(([path, raw]) => buildQuestion(path, raw))
  .sort(
    (a, b) =>
      a.track.localeCompare(b.track) ||
      DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] ||
      a.title.localeCompare(b.title),
  );

export function getQuestion(slug: string) {
  return questions.find((q) => q.slug === slug);
}

async function loadDir(prefix: string): Promise<FileMap> {
  const entries = await Promise.all(
    filePaths
      .filter((p) => p.startsWith(prefix))
      .map(async (p) => [`/${p.slice(prefix.length)}`, await files[p]()] as const),
  );
  return Object.fromEntries(entries);
}

async function loadFile(path: string): Promise<string | undefined> {
  return files[path] ? files[path]() : undefined;
}

/**
 * Starter (or solution) files in the shape the workspace mounts into Sandpack.
 * JS/DSA questions always mount as `/solution.js` + `/solution.test.js`, so the
 * same test file runs against your attempt and the reference answer.
 */
export async function loadQuestionFiles(q: Question, variant: 'starter' | 'solution'): Promise<FileMap> {
  const folder = folderOf(q.slug);

  if (q.type === 'react' || q.type === 'vanilla') {
    return loadDir(`${folder}/${variant}/`);
  }

  const [code, tests] = await Promise.all([
    loadFile(`${folder}/${variant}.js`),
    loadFile(`${folder}/solution.test.js`),
  ]);
  const map: FileMap = { '/solution.js': code ?? '' };
  if (tests) map['/solution.test.js'] = tests;
  return map;
}

export interface QuestionGroup {
  /** Stable id, also used for the sidebar's open state: `js`, `machine-coding/react`… */
  id: string;
  label: string;
  questions: Question[];
  children: QuestionGroup[];
}

const MACHINE_CODING_LABELS: Record<'react' | 'vanilla', string> = { react: 'React', vanilla: 'Vanilla JS' };

/** Which leaf group a question belongs to. */
export function groupIdOf(q: Question) {
  return q.track === 'machine-coding' ? `machine-coding/${q.type}` : q.track;
}

/** JavaScript, DSA, Machine coding › React / Vanilla, in catalog order. */
export const questionTree: QuestionGroup[] = [
  { id: 'js', label: TRACK_LABELS.js, questions: questions.filter((q) => q.track === 'js'), children: [] },
  { id: 'dsa', label: TRACK_LABELS.dsa, questions: questions.filter((q) => q.track === 'dsa'), children: [] },
  {
    id: 'machine-coding',
    label: TRACK_LABELS['machine-coding'],
    questions: [],
    children: (['react', 'vanilla'] as const).map((type) => ({
      id: `machine-coding/${type}`,
      label: MACHINE_CODING_LABELS[type],
      questions: questions.filter((q) => q.track === 'machine-coding' && q.type === type),
      children: [],
    })),
  },
];

export function countQuestions(group: QuestionGroup): number {
  return group.questions.length + group.children.reduce((n, c) => n + countQuestions(c), 0);
}

function findGroup(id: string, groups = questionTree): QuestionGroup | undefined {
  for (const g of groups) {
    if (g.id === id) return g;
    const nested = findGroup(id, g.children);
    if (nested) return nested;
  }
  return undefined;
}

/** Breadcrumb labels for a question, e.g. ['Machine coding', 'React']. */
export function breadcrumbOf(q: Question): string[] {
  return q.track === 'machine-coding'
    ? [TRACK_LABELS['machine-coding'], MACHINE_CODING_LABELS[q.type as 'react' | 'vanilla']]
    : [TRACK_LABELS[q.track]];
}

/** Previous/next question in the same sidebar group. */
export function getNeighbours(q: Question) {
  const list = findGroup(groupIdOf(q))?.questions ?? [];
  const i = list.findIndex((item) => item.slug === q.slug);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
