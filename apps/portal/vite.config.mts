import { fileURLToPath, URL } from 'node:url';

import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { APP_HOST, APP_PORT } = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
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
