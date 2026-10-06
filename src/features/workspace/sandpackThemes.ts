import type { SandpackTheme } from '@codesandbox/sandpack-react';
import type { ResolvedTheme } from '../../lib/theme';

// Mirrors the app tokens in src/index.css so the editor feels like part of the app.
const font: SandpackTheme['font'] = {
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
  size: '13px',
  lineHeight: '20px',
};

const light: SandpackTheme = {
  colors: {
    surface1: '#ffffff',
    surface2: '#e4e4e7',
    surface3: '#f4f4f5',
    disabled: '#a1a1aa',
    base: '#52525b',
    clickable: '#63636e',
    hover: '#18181b',
    accent: '#5b5bd6',
    error: '#cd2b31',
    errorSurface: '#fdecec',
  },
  syntax: {
    plain: '#18181b',
    comment: { color: '#8f8f99', fontStyle: 'italic' },
    keyword: '#7c3aed',
    definition: '#2563eb',
    punctuation: '#63636e',
    property: '#0e7490',
    tag: '#be185d',
    static: '#b45309',
    string: '#15803d',
  },
  font,
};

const dark: SandpackTheme = {
  colors: {
    surface1: '#18181b',
    surface2: '#27272c',
    surface3: '#1f1f23',
    disabled: '#52525b',
    base: '#a0a0ab',
    clickable: '#a0a0ab',
    hover: '#ececef',
    accent: '#9191f5',
    error: '#ff6369',
    errorSurface: '#3a1618',
  },
  syntax: {
    plain: '#ececef',
    comment: { color: '#6f6f7a', fontStyle: 'italic' },
    keyword: '#c4a7ff',
    definition: '#82aaff',
    punctuation: '#a0a0ab',
    property: '#7dd3fc',
    tag: '#f78fb3',
    static: '#ffb86c',
    string: '#a5e3a0',
  },
  font,
};

export const sandpackThemes: Record<ResolvedTheme, SandpackTheme> = { light, dark };
