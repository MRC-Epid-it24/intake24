/* eslint-disable import/no-extraneous-dependencies */
import path from 'node:path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  plugins: [
    laravel({
      input: ['resources/scss/site.scss', 'resources/ts/site.ts'],
      refresh: true,
    }),
  ],
});
