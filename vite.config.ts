import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Local practice tool: the main chunk carries the quiz markdown and the question chunk carries Sandpack.
  build: { chunkSizeWarningLimit: 1000 },
});
