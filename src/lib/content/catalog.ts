import { parseFrontmatter } from './frontmatter.js';
import dsaTopics from '../../../content/dsa/topics.json';

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
  /** Sidebar/topic group this question lives in: `js`, `dsa/trees`, `machine-coding/react`. */
  groupId: string;
  /** Position inside its topic (DSA follows the NeetCode order). */
  order?: number;
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
  const track = slug.split('/')[0] as Track;
  const groupId =
    track === 'machine-coding' ? `machine-coding/${type}` : track === 'dsa' ? `dsa/${slug.split('/')[1]}` : track;

  return {
    slug,
    track,
    groupId,
    order: data.order,
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
      a.groupId.localeCompare(b.groupId) ||
      // DSA keeps the curated NeetCode order inside a topic; elsewhere easy → hard.
      (a.order ?? 0) - (b.order ?? 0) ||
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

/** Starter or solution files for a machine-coding (React / vanilla) sandbox. */
export async function loadQuestionFiles(q: Question, variant: 'starter' | 'solution'): Promise<FileMap> {
  return loadDir(`${folderOf(q.slug)}/${variant}/`);
}

export interface DsaCase {
  input: unknown[];
  expected?: unknown;
  hidden?: boolean;
}

export interface DsaSpec {
  fn: string;
  kind?: 'function' | 'design' | 'codec';
  params?: { name: string; type: string; of?: number }[];
  returns?: string;
  compare?: string;
  cases: DsaCase[];
}

/** Everything the code runner needs for a JS or DSA question. */
export interface RunnerAssets {
  starter: string;
  solution?: string;
  /** JS questions: Jest-style suite. */
  tests?: string;
  /** DSA questions: data-driven cases. */
  spec?: DsaSpec;
  checker?: string;
}

export async function loadRunnerAssets(q: Question): Promise<RunnerAssets> {
  const folder = folderOf(q.slug);
  const [starter, solution, tests, cases, checker] = await Promise.all([
    loadFile(`${folder}/starter.js`),
    loadFile(`${folder}/solution.js`),
    loadFile(`${folder}/solution.test.js`),
    loadFile(`${folder}/cases.json`),
    loadFile(`${folder}/checker.js`),
  ]);
  return { starter: starter ?? '', solution, tests, spec: cases ? (JSON.parse(cases) as DsaSpec) : undefined, checker };
}

/** Just the reference solution source, for the read-only Solution tab. */
export function loadSolutionSource(q: Question) {
  return loadFile(`${folderOf(q.slug)}/solution.js`);
}

export interface QuestionGroup {
  /** Stable id, also used for the sidebar's open state: `js`, `machine-coding/react`… */
  id: string;
  label: string;
  questions: Question[];
  children: QuestionGroup[];
}

const MACHINE_CODING_LABELS: Record<'react' | 'vanilla', string> = { react: 'React', vanilla: 'Vanilla JS' };

interface TopicDef {
  id: string;
  label: string;
  neetcode?: boolean;
  problems: string[];
}

const TOPICS = dsaTopics as TopicDef[];

/** Which leaf group a question belongs to. */
export function groupIdOf(q: Question) {
  return q.groupId;
}

const inGroup = (id: string) => questions.filter((q) => q.groupId === id);

/** JavaScript, DSA › <NeetCode topics>, Machine coding › React / Vanilla. Leaves are topics. */
export const questionTree: QuestionGroup[] = [
  { id: 'js', label: TRACK_LABELS.js, questions: inGroup('js'), children: [] },
  {
    id: 'dsa',
    label: 'DSA · NeetCode 150',
    questions: [],
    children: TOPICS.map((t) => ({ id: `dsa/${t.id}`, label: t.label, questions: inGroup(`dsa/${t.id}`), children: [] })),
  },
  {
    id: 'machine-coding',
    label: TRACK_LABELS['machine-coding'],
    questions: [],
    children: (['react', 'vanilla'] as const).map((type) => ({
      id: `machine-coding/${type}`,
      label: MACHINE_CODING_LABELS[type],
      questions: inGroup(`machine-coding/${type}`),
      children: [],
    })),
  },
];

export function countQuestions(group: QuestionGroup): number {
  return group.questions.length + group.children.reduce((n, c) => n + countQuestions(c), 0);
}

/** Every question in a group, including nested groups, in display order. */
export function questionsIn(group: QuestionGroup): Question[] {
  return [...group.questions, ...group.children.flatMap(questionsIn)];
}

export function findGroup(id: string, groups = questionTree): QuestionGroup | undefined {
  for (const g of groups) {
    if (g.id === id) return g;
    const nested = findGroup(id, g.children);
    if (nested) return nested;
  }
  return undefined;
}

/** Ancestor chain of a group id, root first: `dsa/trees` → [dsa, dsa/trees]. */
export function groupPath(id: string): QuestionGroup[] {
  const parts = id.split('/');
  return parts.map((_, i) => findGroup(parts.slice(0, i + 1).join('/'))).filter(Boolean) as QuestionGroup[];
}

/** Breadcrumb for a question, e.g. [DSA · NeetCode 150, Trees]. */
export function breadcrumbOf(q: Question): QuestionGroup[] {
  return groupPath(q.groupId);
}

/** Previous/next question in the same topic. */
export function getNeighbours(q: Question) {
  const list = findGroup(q.groupId)?.questions ?? [];
  const i = list.findIndex((item) => item.slug === q.slug);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
