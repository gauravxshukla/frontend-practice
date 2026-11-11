import type { FileMap } from '../../../lib/content/catalog';

// React Native questions run in Sandpack's react template through
// react-native-web. Sandpack's bundler can't alias packages (an
// `npm:react-native-web` alias crashes it), but it does resolve files placed
// under /node_modules, so a tiny `react-native` package re-exports
// react-native-web and user code imports 'react-native' like on a device.

export type Platform = 'web' | 'native';

/** Pinned so a react-native-web release can't change behaviour under the user. */
export const RN_WEB_VERSION = '0.21.4';

const ENTRY = `import { AppRegistry } from 'react-native';
import App from './App';

// A full-height root, like a phone screen.
const style = document.createElement('style');
style.textContent = 'html, body, #root { height: 100%; margin: 0; } #root { display: flex; }';
document.head.appendChild(style);

AppRegistry.registerComponent('main', () => App);
// react-native-web announces itself with dev-mode logs; keep the console for the user's own output.
const log = console.log;
console.log = () => {};
try {
  AppRegistry.runApplication('main', { rootTag: document.getElementById('root') });
} finally {
  console.log = log;
}
`;

/** Plumbing files the user never sees: the entry point and the `react-native` shim package. */
export const NATIVE_RUNTIME_FILES: FileMap = {
  '/index.js': ENTRY,
  '/node_modules/react-native/package.json': JSON.stringify({ name: 'react-native', version: '0.0.0-web', main: 'index.js' }),
  '/node_modules/react-native/index.js': "export * from 'react-native-web';\n",
};

/** Web-only files dropped when a web starter's data files are reused for React Native. */
export const isWebOnlyFile = (path: string) => path.endsWith('.css');

/** The sandbox setup for a React Native attempt: the user's files plus hidden runtime files and dependencies. */
export function nativeSetup(files: FileMap, dependencies: Record<string, string> = {}) {
  return {
    files: { ...files, ...NATIVE_RUNTIME_FILES },
    hidden: Object.keys(NATIVE_RUNTIME_FILES),
    dependencies: { ...dependencies, 'react-native-web': RN_WEB_VERSION },
  };
}

/**
 * A link that opens the user's files in Expo Snack, to run them on a real
 * device with Expo Go (snack.expo.dev `files` URL parameter).
 */
export function snackUrl(files: FileMap, name: string, dependencies: Record<string, string> = {}) {
  const snackFiles = Object.fromEntries(
    Object.entries(files).map(([path, contents]) => [path.replace(/^\//, ''), { type: 'CODE', contents }]),
  );
  const params = new URLSearchParams({ name, files: JSON.stringify(snackFiles) });
  const deps = Object.keys(dependencies);
  if (deps.length) params.set('dependencies', deps.join(','));
  return `https://snack.expo.dev/?${params}`;
}
