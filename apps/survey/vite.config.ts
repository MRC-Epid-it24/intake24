import childProcess from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { createVuePlugin } from 'vite-plugin-vue2';
import pkg from './package.json';

// Set build info for application
process.env.VITE_APP_BUILD_VERSION = pkg.version;
process.env.VITE_APP_BUILD_REVISION = childProcess
  .execSync('git rev-parse --short HEAD', { cwd: path.resolve(__dirname, '..') })
  .toString()
  .trim();
process.env.VITE_APP_BUILD_DATE = new Date().toISOString();

const themeColor = '#EF6C00';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

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
            '@import "./src/scss/variables"',
            '@import "vuetify/src/styles/settings/_variables"',
            '',
          ].join('\n'),
        },
      },
    },
    base: process.env.BASE_URL || '/',
    build: {
      emptyOutDir: true,
      outDir: env.OUTPUT_DIR || 'dist',
    },
    server: {
      port: 8200,
      proxy: {
        '/api': {
          target: 'http://localhost:3100',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      createVuePlugin(),
      Components({
        resolvers: [VuetifyResolver()],
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
            title: env.VITE_APP_NAME,
            themeColor,
            reCaptcha:
              env.VITE_APP_RECAPTCHA_ENABLED === 'true'
                ? `<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>`
                : '',
          },
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [/* 'favicon.svg',*/ 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
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
        },
      }),
    ],
  };
});
