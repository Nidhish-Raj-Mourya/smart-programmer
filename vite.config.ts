import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves from /smart-programmer/
export default defineConfig({
  plugins: [react()],
  base: '/smart-programmer/',
});
