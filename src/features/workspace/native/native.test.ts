import { describe, expect, it } from 'vitest';
import { draftKey } from '../../../lib/drafts';
import { defaultNativeStarter } from './defaultStarter';
import { isWebOnlyFile, nativeSetup, NATIVE_RUNTIME_FILES, RN_WEB_VERSION, snackUrl } from './nativeSetup';

describe('nativeSetup', () => {
  it('adds the hidden react-native shim and entry, and the react-native-web dependency', () => {
    const setup = nativeSetup({ '/App.js': 'app', '/users.js': 'data' }, { lodash: '4' });
    expect(setup.files['/App.js']).toBe('app');
    expect(setup.files['/node_modules/react-native/index.js']).toContain("export * from 'react-native-web'");
    expect(JSON.parse(setup.files['/node_modules/react-native/package.json'])).toMatchObject({ name: 'react-native', main: 'index.js' });
    expect(setup.files['/index.js']).toContain("AppRegistry.runApplication('main'");
    expect(setup.hidden).toEqual(Object.keys(NATIVE_RUNTIME_FILES));
    expect(setup.dependencies).toEqual({ lodash: '4', 'react-native-web': RN_WEB_VERSION });
  });

  it('treats CSS as web-only', () => {
    expect(isWebOnlyFile('/styles.css')).toBe(true);
    expect(isWebOnlyFile('/users.js')).toBe(false);
  });
});

describe('snackUrl', () => {
  it('encodes files in Expo Snack’s `files` format without leading slashes', () => {
    const url = new URL(snackUrl({ '/App.js': 'export default 1;', '/lib/x.js': 'x' }, 'Data Table', { lodash: '4' }));
    expect(url.origin).toBe('https://snack.expo.dev');
    expect(url.searchParams.get('name')).toBe('Data Table');
    expect(JSON.parse(url.searchParams.get('files')!)).toEqual({
      'App.js': { type: 'CODE', contents: 'export default 1;' },
      'lib/x.js': { type: 'CODE', contents: 'x' },
    });
    expect(url.searchParams.get('dependencies')).toBe('lodash');
  });
});

describe('defaultNativeStarter', () => {
  it('imports from react-native and embeds the title safely', () => {
    const app = defaultNativeStarter('Tabs {nested} <b>');
    expect(app).toContain("from 'react-native'");
    expect(app).toContain('{"Tabs {nested} <b>"}');
  });
});

describe('draftKey', () => {
  it('keeps React Native drafts apart from web drafts', () => {
    expect(draftKey('machine-coding/react/stopwatch')).toBe('machine-coding/react/stopwatch');
    expect(draftKey('machine-coding/react/stopwatch', 'native')).toBe('machine-coding/react/stopwatch#native');
  });
});
