import childProcess from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';

import viteLegacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue2';
import unFonts from 'unplugin-fonts/vite';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';

import { isCaptchaProvider, resolveCaptchaScript } from '../../packages/common/src/security';
import { colors } from '../../packages/common/src/theme';
import pkg from './package.json';

// Set build info for application
process.env.VITE_APP_BUILD_VERSION = pkg.version;
process.env.VITE_APP_BUILD_REVISION = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();
process.env.VITE_APP_BUILD_DATE = new Date().toISOString();

export default defineConfig(({ mode }) => {
  const {
    API_HOST,
    BASE_URL: base = '/',
    OUTPUT_DIR: outDir = 'dist',
    PRODUCTION_SOURCE_MAP,
    DISABLE_PWA,
    EMPTY_OUT_DIR = 'true',
    DEV_HTTPS,
    LEGACY,
    VITE_APP_NAME: appName,
    VITE_CAPTCHA_PROVIDER: captchaProvider,
  } = loadEnv(mode, process.cwd(), '');

  const disablePwa = !!(DISABLE_PWA === 'true');
  const emptyOutDir = !!(EMPTY_OUT_DIR === 'true');
  const https = !!(DEV_HTTPS === 'true');
  const legacy = !!(LEGACY === 'true');
  const sourcemap = !!(PRODUCTION_SOURCE_MAP === 'true');

  if (captchaProvider && !isCaptchaProvider(captchaProvider))
    throw new Error('Invalid Captcha provider');

  return {
    resolve: {
      alias: {
        '@intake24/survey': fileURLToPath(new URL('./src', import.meta.url)),
        '@intake24/common': fileURLToPath(new URL('../../packages/common/src', import.meta.url)),
        '@intake24/i18n': fileURLToPath(new URL('../../packages/i18n/src', import.meta.url)),
        '@intake24/ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: [
            '@import "./src/scss/vuetify"',
            '@import "vuetify/src/styles/settings/_variables"',
            '',
          ].join('\n'),
        },
      },
    },
    base,
    build: {
      emptyOutDir,
      outDir,
      sourcemap,
      rollupOptions: {
        output: {
          assetFileNames: ({ name }) => {
            let subDir = '';

            if (name?.match(/\.(woff2|ttf)$/)) subDir = 'fonts/';
            else if (name?.match(/\.(jpe?g|png|svg)$/)) subDir = 'imgs/';

            return `assets/${subDir}[name]-[hash][extname]`;
          },
          manualChunks: (id) => {
            if (id.includes('echarts')) return 'echarts';
          },
        },
      },
    },
    server: {
      port: 8200,
      host: '0.0.0.0',
      https,
      proxy: {
        '/api': {
          target: API_HOST,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VuetifyResolver()],
        directoryAsNamespace: true,
      }),
      legacy ? viteLegacy() : undefined,
      https ? mkcert() : undefined,
      unFonts({
        google: {
          families: [
            {
              name: 'Rubik',
              styles: 'wght@300;400;500;600;700',
              defer: false,
            },
          ],
        },
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: appName,
            themeColor: colors.primary,
            captcha: resolveCaptchaScript(captchaProvider),
          },
        },
      }),
      VitePWA({
        disable: disablePwa,
        registerType: 'autoUpdate',
        includeAssets: [
          'icons/icon.svg',
          'icons/icon.ico',
          'icons/apple-touch-icon-180x180.png',
          'robots.txt',
        ],
        manifest: {
          id: '/',
          start_url: '/',
          name: appName,
          short_name: appName,
          description: pkg.description,
          theme_color: colors.primary,
          icons: [
            {
              src: 'icons/pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'icons/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3000000,
          /* globIgnores: ['index.html'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: { cacheName: 'index' },
            },
          ], */
        },
      }),
    ].filter(Boolean),
  };
});
