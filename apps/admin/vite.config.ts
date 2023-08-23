import childProcess from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';

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
    VITE_APP_NAME: appName,
    VITE_CAPTCHA_PROVIDER: captchaProvider,
  } = loadEnv(mode, process.cwd(), '');

  const sourcemap = !!(PRODUCTION_SOURCE_MAP === 'true');
  const disablePwa = !!(DISABLE_PWA === 'true');
  const emptyOutDir = !!(EMPTY_OUT_DIR === 'true');
  const https = !!(DEV_HTTPS === 'true');

  if (captchaProvider && !isCaptchaProvider(captchaProvider))
    throw new Error('Invalid Captcha provider');

  return {
    resolve: {
      alias: {
        '@intake24/admin': fileURLToPath(new URL('./src', import.meta.url)),
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
            if (id.includes('json-editor-vue')) return 'json-editor';
            if (id.includes('tinymce')) return 'tinymce';
          },
        },
      },
    },
    server: {
      port: 8100,
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
        includeAssets: [/* 'favicon.svg',*/ 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          start_url: '/',
          name: appName,
          short_name: appName,
          description: pkg.description,
          theme_color: colors.primary,
          icons: [
            {
              src: 'img/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'img/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'img/icons/pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          importScripts: ['js/web-push.js'],
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
