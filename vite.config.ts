import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site under /<repo>/; the deploy workflow sets BASE_PATH, local dev stays at '/'.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  // Local practice tool: the main chunk carries the quiz markdown and the question chunk carries Sandpack.
  build: { chunkSizeWarningLimit: 1000 },
});
