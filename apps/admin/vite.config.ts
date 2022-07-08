import childProcess from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

import pkg from './package.json';
import { isCaptchaProvider } from '../../packages/common/src/types';
import { resolveCaptchaScript } from '../../packages/ui/src/captcha/util';

// Set build info for application
process.env.VITE_APP_BUILD_VERSION = pkg.version;
process.env.VITE_APP_BUILD_REVISION = childProcess
  .execSync('git rev-parse --short HEAD', { cwd: path.resolve(__dirname, '..') })
  .toString()
  .trim();
process.env.VITE_APP_BUILD_DATE = new Date().toISOString();

const themeColor = '#EF6C00';

export default defineConfig(({ mode }) => {
  const {
    BASE_URL: base = '/',
    OUTPUT_DIR: outDir = 'dist',
    PRODUCTION_SOURCE_MAP,
    DISABLE_PWA,
    VITE_APP_NAME: appName,
    VITE_APP_CAPTCHA_PROVIDER: captchaProvider,
  } = loadEnv(mode, process.cwd(), '');

  const sourcemap = !!(PRODUCTION_SOURCE_MAP === 'true');
  const disablePwa = !!(DISABLE_PWA === 'true');

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
            '@import "./src/scss/variables"',
            '@import "vuetify/src/styles/settings/_variables"',
            '',
          ].join('\n'),
        },
      },
    },
    base,
    build: {
      emptyOutDir: true,
      outDir,
      sourcemap,
    },
    server: {
      port: 8100,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3100',
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
      VitePluginFonts({
        google: {
          families: [
            {
              name: 'Open Sans',
              styles: 'wght@300;400;600;700;900',
              defer: false,
            },
          ],
        },
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: appName,
            themeColor,
            captcha: resolveCaptchaScript(captchaProvider),
          },
        },
      }),
      VitePWA({
        disable: disablePwa,
        registerType: 'autoUpdate',
        includeAssets: [/* 'favicon.svg',*/ 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: appName,
          short_name: appName,
          description: pkg.description,
          theme_color: themeColor,
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
        },
      }),
    ],
  };
});
