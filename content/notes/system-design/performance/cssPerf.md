## Modularizing CSS and Minimizing for Performance

### Sass/SCSS for Modular CSS
- **Partials and imports**: Split styles into partials (filenames starting with `_`) and compose them in an entry file.
```
// _variables.scss
$brand-primary: #5b8def;
$spacing-md: 16px;

// _buttons.scss
.button {
  padding: $spacing-md;
  background: $brand-primary;
}

// styles.scss
@use 'variables' as *;
@use 'buttons';
```
- **@use and @forward (recommended over @import)**:
  - `@use` loads a stylesheet once, with its own namespace by default.
  - `@forward` re-exports members, enabling public APIs from a central index.
``` 
// _index.scss
@forward 'variables';
@forward 'buttons';

// styles.scss
@use './index' as *; // brings forwarded members into scope
```
- **Nesting (with care)**: Keep to 1–2 levels to avoid heavy selectors.
```
.card {
  &__title { font-weight: 600; }
  &--interactive { cursor: pointer; }
}
```
- **Mixins and functions**: DRY responsive rules and patterns.
```
@mixin respond($breakpoint) {
  @if $breakpoint == 'md' { @media (min-width: 768px) { @content; } }
}

.box { width: 100%; @include respond('md') { width: 50%; } }
```
- **Placeholders (%extends) for composition**: Share selector bodies without HTML class bloat.
```
%visually-hidden { position: absolute; clip: rect(0 0 0 0); }
.sr-only { @extend %visually-hidden; }
```

### Architectural Patterns for Modularity
- **BEM naming**: `block__element--modifier` keeps selectors flat and predictable.
- **CSS Modules**: Locally-scoped class names per file in React/Vite/Next.
- **Utility-first (Tailwind-like)**: Small, composable utilities reduce custom CSS size if adopted consistently.
- **Layering**: Base → Tokens → Utilities → Components → Layout → Pages.
- **Design tokens**: Centralize color, spacing, typography variables in one source of truth.

### File Organization Example (SCSS)
```
styles/
  _tokens.scss
  _mixins.scss
  components/
    _button.scss
    _card.scss
  layout/
    _grid.scss
    _header.scss
  pages/
    _home.scss
  index.scss // @use and @forward here
```

### Build Setup Tips
- Prefer `@use/@forward` over legacy `@import`.
- Enable source maps in dev; disable in prod.
- Enforce linting (Stylelint) and a formatter.
- Guard bundle size with CI checks (e.g., `size-limit`).

### CSS Minimization and Runtime Performance
- **Minification**: Remove whitespace/comments; shorten values.
  - Tools: `cssnano`, `csso`, PostCSS preset.
- **Dead code elimination (purge/treeshake)**: Remove unused selectors based on content scanning.
  - Tools: Tailwind JIT purge, `@fullhuman/postcss-purgecss`.
- **Critical CSS**: Inline above-the-fold CSS, defer the rest.
  - Tools: `critters`, `penthouse`.
- **Code-splitting CSS**: Split per-route or per-component.
  - In frameworks, enable CSS chunking via bundlers.
- **HTTP optimizations**: Use HTTP/2, long cache for hashed files, preconnect fonts, `rel=preload` key CSS.
- **Reduce specificity and nesting**: Simpler selectors render faster and are easier to override.
- **Limit expensive properties**: Avoid layout-thrashing (e.g., `position: fixed` with frequent changes); animate `transform`/`opacity`.
- **Media queries and container queries**: Prefer mobile-first; compose queries via mixins.
- **Images and fonts**: Compress images, subset fonts, use modern formats (AVIF/WOFF2), `font-display: swap`.

### Example PostCSS + Sass toolchain
```
// package.json scripts
"build:css": "sass styles/index.scss dist/styles.css --no-source-map && postcss dist/styles.css -o dist/styles.min.css",

// postcss.config.js
module.exports = { plugins: [require('autoprefixer'), require('cssnano')({ preset: 'default' })] };
```

### Quick Checklist
- Use SCSS partials with `@use/@forward` and tokens.
- Keep nesting shallow; prefer BEM or Modules.
- Minify, purge unused CSS, inline critical, split by route.
- Cache-bust and serve over HTTP/2; optimize images/fonts.
