import path from 'node:path';

import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { APP_HOST, APP_PORT } = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      },
    },
    server: {
      proxy: {
        '/img': `http://${APP_HOST}:${APP_PORT}`,
      },
    },
    plugins: [
      laravel({
        input: ['resources/scss/site.scss', 'resources/ts/site.ts'],
        refresh: true,
      }),
    ],
  };
});
