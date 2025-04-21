import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html', 'json'], // Show in terminal + generate HTML report
      all: true,
      exclude: ['node_modules/', 'dist/', '**/*.test.{js,jsx,ts,tsx}'], // Exclude tests and builds
    },
  },
});
