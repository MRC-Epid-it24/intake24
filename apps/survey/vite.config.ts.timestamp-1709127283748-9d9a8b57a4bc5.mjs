// vite.config.ts
import childProcess from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import viteLegacy from "file:///Users/jamie/intake24/node_modules/.pnpm/@vitejs+plugin-legacy@5.3.0_esbuild@0.19.12_terser@5.27.0_vite@5.1.1/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///Users/jamie/intake24/node_modules/.pnpm/@vitejs+plugin-vue2@2.3.1_vite@5.1.1_vue@2.7.16/node_modules/@vitejs/plugin-vue2/dist/index.mjs";
import { VuetifyResolver } from "file:///Users/jamie/intake24/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@2.79.1_vue@2.7.16/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///Users/jamie/intake24/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@2.79.1_vue@2.7.16/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///Users/jamie/intake24/node_modules/.pnpm/vite@5.1.1_@types+node@20.11.17_sass@1.32.13_terser@5.27.0/node_modules/vite/dist/node/index.js";
import { createHtmlPlugin } from "file:///Users/jamie/intake24/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.1.1/node_modules/vite-plugin-html/dist/index.mjs";
import mkcert from "file:///Users/jamie/intake24/node_modules/.pnpm/vite-plugin-mkcert@1.17.3_vite@5.1.1/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import { VitePWA } from "file:///Users/jamie/intake24/node_modules/.pnpm/vite-plugin-pwa@0.17.5_vite@5.1.1_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import webfontDownload from "file:///Users/jamie/intake24/node_modules/.pnpm/vite-plugin-webfont-dl@3.9.1_vite@5.1.1/node_modules/vite-plugin-webfont-dl/dist/index.mjs";

// ../../packages/common/src/security/acl.ts
var standardSecurableActions = ["read", "edit", "delete", "securables"];
var securableDefs = {
  FeedbackScheme: [
    ...standardSecurableActions,
    "copy",
    "top-foods",
    "meals",
    "cards",
    "demographic-groups",
    "henry-coefficients",
    "use"
  ],
  Language: [...standardSecurableActions, "translations", "use"],
  Locale: [
    ...standardSecurableActions,
    "copy",
    "food-list",
    "split-lists",
    "recipe-foods",
    "split-words",
    "synonym-sets",
    "tasks",
    "use"
  ],
  SurveyScheme: [...standardSecurableActions, "copy", "prompts", "data-export", "use"],
  Survey: [
    ...standardSecurableActions,
    "overrides",
    "respondents",
    "submissions",
    "support",
    "tasks"
  ]
};
var securableTypes = Object.keys(securableDefs);

// ../../packages/common/src/security/captcha.ts
var captchaProviders = ["h-captcha", "re-captcha"];
var isCaptchaProvider = (provider) => captchaProviders.includes(provider);
var resolveCaptchaScript = (provider) => {
  switch (provider) {
    case "h-captcha":
      return `<script type="text/javascript" src="https://js.hcaptcha.com/1/api.js" async defer></script>`;
    case "re-captcha":
      return `<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>`;
    default:
      return "";
  }
};

// ../../packages/common/src/theme/index.ts
var colors = {
  primary: "#EE672D",
  secondary: "#020202",
  ternary: "#FEE8E1",
  quaternary: "#D34980",
  accent: "#F68623",
  info: "#4456A6",
  "info-2": "#77C044",
  "info-3": "#B968DC",
  "info-4": "#41C3EC",
  "info-5": "#FFDB59"
};

// package.json
var package_default = {
  name: "@intake24/survey",
  version: "2024.1.0",
  description: "Intake24 Survey App",
  private: true,
  license: "Apache-2.0",
  repository: {
    type: "git",
    url: "https://github.com/MRC-Epid-it24/intake24.git",
    directory: "apps/survey"
  },
  type: "module",
  scripts: {
    dev: "vite",
    build: "pnpm build-only",
    preview: "vite preview --port 4173",
    "build-only": "vite build",
    "generate-pwa-assets": "pwa-assets-generator",
    start: "node server/index.js",
    "type-check": "vue-tsc --noEmit",
    lint: "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path ../../.eslintignore"
  },
  dependencies: {
    "@coddicat/vue-pinch-scroll-zoom": "^3.3.4",
    "@fortawesome/fontawesome-free": "^6.5.1",
    "@vueuse/core": "^10.7.2",
    "awesome-phonenumber": "^6.4.0",
    axios: "^1.6.7",
    "axios-retry": "^4.0.0",
    dotenv: "^16.4.4",
    "dotenv-expand": "^11.0.6",
    express: "^4.18.2",
    "flag-icons": "^7.1.0",
    helmet: "^7.1.0",
    lodash: "^4.17.21",
    pinia: "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    uuid: "^9.0.1",
    vue: "^2.7.16",
    "vue-gtag": "^1.16.1",
    "vue-i18n": "^8.28.2",
    "vue-router": "^3.6.5",
    vuetify: "^2.7.2"
  },
  devDependencies: {
    "@types/jsdom": "^21.1.6",
    "@types/lodash": "^4.14.202",
    "@types/node": "^20.11.19",
    "@types/uuid": "^9.0.8",
    "@vite-pwa/assets-generator": "^0.2.4",
    "@vitejs/plugin-legacy": "^5.3.0",
    "@vitejs/plugin-vue2": "^2.3.1",
    "@vue/eslint-config-prettier": "^9.0.0",
    "@vue/eslint-config-typescript": "^12.0.0",
    eslint: "^8.56.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-simple-import-sort": "^12.0.0",
    "eslint-plugin-vue": "^9.21.1",
    jsdom: "^24.0.0",
    prettier: "^3.2.5",
    sass: "~1.32.13",
    terser: "^5.27.2",
    typescript: "^5.3.3",
    "unplugin-vue-components": "^0.26.0",
    vite: "^5.1.3",
    "vite-plugin-html": "^3.2.2",
    "vite-plugin-mkcert": "^1.17.3",
    "vite-plugin-pwa": "^0.19.0",
    "vite-plugin-webfont-dl": "^3.9.1",
    vitest: "^1.3.0",
    "vue-tsc": "^1.8.27",
    "workbox-window": "^7.0.0"
  },
  bundledDependencies: [
    "@intake24/survey",
    "@intake24/common",
    "@intake24/i18n",
    "@intake24/ui"
  ]
};

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///Users/jamie/intake24/apps/survey/vite.config.ts";
process.env.VITE_APP_BUILD_VERSION = package_default.version;
process.env.VITE_APP_BUILD_REVISION = childProcess.execSync("git rev-parse --short HEAD").toString().trim();
process.env.VITE_APP_BUILD_DATE = (/* @__PURE__ */ new Date()).toISOString();
var vite_config_default = defineConfig(({ mode }) => {
  const {
    API_HOST,
    BASE_URL: base = "/",
    OUTPUT_DIR: outDir = "dist",
    PRODUCTION_SOURCE_MAP,
    DISABLE_PWA,
    EMPTY_OUT_DIR = "true",
    DEV_HTTPS,
    DEV_MKCERT_PATH,
    LEGACY,
    VITE_APP_NAME: appName,
    VITE_CAPTCHA_PROVIDER: captchaProvider
  } = loadEnv(mode, process.cwd(), "");
  const disablePwa = !!(DISABLE_PWA === "true");
  const emptyOutDir = !!(EMPTY_OUT_DIR === "true");
  const https = !!(DEV_HTTPS === "true");
  const legacy = !!(LEGACY === "true");
  const sourcemap = !!(PRODUCTION_SOURCE_MAP === "true");
  if (captchaProvider && !isCaptchaProvider(captchaProvider))
    throw new Error("Invalid Captcha provider");
  return {
    resolve: {
      alias: {
        "@intake24/survey": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "@intake24/common": fileURLToPath(new URL("../../packages/common/src", __vite_injected_original_import_meta_url)),
        "@intake24/i18n": fileURLToPath(new URL("../../packages/i18n/src", __vite_injected_original_import_meta_url)),
        "@intake24/ui": fileURLToPath(new URL("../../packages/ui/src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: [
            '@import "./src/scss/vuetify"',
            '@import "vuetify/src/styles/settings/_variables"',
            ""
          ].join("\n")
        }
      }
    },
    base,
    build: {
      emptyOutDir,
      outDir,
      sourcemap,
      rollupOptions: {
        output: {
          assetFileNames: ({ name }) => {
            let subDir = "";
            if (name?.match(/\.(woff2|ttf)$/))
              subDir = "fonts/";
            else if (name?.match(/\.(jpe?g|png|svg)$/))
              subDir = "imgs/";
            return `assets/${subDir}[name]-[hash][extname]`;
          },
          manualChunks: (id) => {
            if (id.includes("echarts"))
              return "echarts";
          }
        }
      }
    },
    server: {
      port: 8200,
      host: "0.0.0.0",
      https,
      proxy: {
        "/api": {
          target: API_HOST,
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VuetifyResolver()],
        directoryAsNamespace: true
      }),
      legacy ? viteLegacy() : void 0,
      https ? mkcert({ savePath: DEV_MKCERT_PATH }) : void 0,
      webfontDownload([
        "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
      ]),
      createHtmlPlugin({
        inject: {
          data: {
            title: appName,
            themeColor: colors.primary,
            captcha: resolveCaptchaScript(captchaProvider)
          }
        }
      }),
      VitePWA({
        disable: disablePwa,
        registerType: "autoUpdate",
        includeAssets: [
          "icons/icon.svg",
          "icons/icon.ico",
          "icons/apple-touch-icon-180x180.png",
          "robots.txt"
        ],
        manifest: {
          id: "/",
          start_url: "/",
          name: appName,
          short_name: appName,
          description: package_default.description,
          theme_color: colors.primary,
          icons: [
            {
              src: "icons/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png"
            },
            {
              src: "icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icons/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3e6,
          globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"]
        }
      })
    ].filter(Boolean)
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9zZWN1cml0eS9hY2wudHMiLCAiLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9zZWN1cml0eS9jYXB0Y2hhLnRzIiwgIi4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvdGhlbWUvaW5kZXgudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2phbWllL2ludGFrZTI0L2FwcHMvc3VydmV5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvamFtaWUvaW50YWtlMjQvYXBwcy9zdXJ2ZXkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2phbWllL2ludGFrZTI0L2FwcHMvc3VydmV5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuXG5pbXBvcnQgdml0ZUxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUyJztcbmltcG9ydCB7IFZ1ZXRpZnlSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xuaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgd2ViZm9udERvd25sb2FkIGZyb20gJ3ZpdGUtcGx1Z2luLXdlYmZvbnQtZGwnO1xuXG5pbXBvcnQgeyBpc0NhcHRjaGFQcm92aWRlciwgcmVzb2x2ZUNhcHRjaGFTY3JpcHQgfSBmcm9tICcuLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3NlY3VyaXR5JztcbmltcG9ydCB7IGNvbG9ycyB9IGZyb20gJy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvdGhlbWUnO1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5cbi8vIFNldCBidWlsZCBpbmZvIGZvciBhcHBsaWNhdGlvblxucHJvY2Vzcy5lbnYuVklURV9BUFBfQlVJTERfVkVSU0lPTiA9IHBrZy52ZXJzaW9uO1xucHJvY2Vzcy5lbnYuVklURV9BUFBfQlVJTERfUkVWSVNJT04gPSBjaGlsZFByb2Nlc3NcbiAgLmV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tc2hvcnQgSEVBRCcpXG4gIC50b1N0cmluZygpXG4gIC50cmltKCk7XG5wcm9jZXNzLmVudi5WSVRFX0FQUF9CVUlMRF9EQVRFID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBBUElfSE9TVCxcbiAgICBCQVNFX1VSTDogYmFzZSA9ICcvJyxcbiAgICBPVVRQVVRfRElSOiBvdXREaXIgPSAnZGlzdCcsXG4gICAgUFJPRFVDVElPTl9TT1VSQ0VfTUFQLFxuICAgIERJU0FCTEVfUFdBLFxuICAgIEVNUFRZX09VVF9ESVIgPSAndHJ1ZScsXG4gICAgREVWX0hUVFBTLFxuICAgIERFVl9NS0NFUlRfUEFUSCxcbiAgICBMRUdBQ1ksXG4gICAgVklURV9BUFBfTkFNRTogYXBwTmFtZSxcbiAgICBWSVRFX0NBUFRDSEFfUFJPVklERVI6IGNhcHRjaGFQcm92aWRlcixcbiAgfSA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuXG4gIGNvbnN0IGRpc2FibGVQd2EgPSAhIShESVNBQkxFX1BXQSA9PT0gJ3RydWUnKTtcbiAgY29uc3QgZW1wdHlPdXREaXIgPSAhIShFTVBUWV9PVVRfRElSID09PSAndHJ1ZScpO1xuICBjb25zdCBodHRwcyA9ICEhKERFVl9IVFRQUyA9PT0gJ3RydWUnKTtcbiAgY29uc3QgbGVnYWN5ID0gISEoTEVHQUNZID09PSAndHJ1ZScpO1xuICBjb25zdCBzb3VyY2VtYXAgPSAhIShQUk9EVUNUSU9OX1NPVVJDRV9NQVAgPT09ICd0cnVlJyk7XG5cbiAgaWYgKGNhcHRjaGFQcm92aWRlciAmJiAhaXNDYXB0Y2hhUHJvdmlkZXIoY2FwdGNoYVByb3ZpZGVyKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQ2FwdGNoYSBwcm92aWRlcicpO1xuXG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0BpbnRha2UyNC9zdXJ2ZXknOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgICdAaW50YWtlMjQvY29tbW9uJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgICdAaW50YWtlMjQvaTE4bic6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4vLi4vcGFja2FnZXMvaTE4bi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICAgJ0BpbnRha2UyNC91aSc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4vLi4vcGFja2FnZXMvdWkvc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNhc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogW1xuICAgICAgICAgICAgJ0BpbXBvcnQgXCIuL3NyYy9zY3NzL3Z1ZXRpZnlcIicsXG4gICAgICAgICAgICAnQGltcG9ydCBcInZ1ZXRpZnkvc3JjL3N0eWxlcy9zZXR0aW5ncy9fdmFyaWFibGVzXCInLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBiYXNlLFxuICAgIGJ1aWxkOiB7XG4gICAgICBlbXB0eU91dERpcixcbiAgICAgIG91dERpcixcbiAgICAgIHNvdXJjZW1hcCxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICh7IG5hbWUgfSkgPT4ge1xuICAgICAgICAgICAgbGV0IHN1YkRpciA9ICcnO1xuXG4gICAgICAgICAgICBpZiAobmFtZT8ubWF0Y2goL1xcLih3b2ZmMnx0dGYpJC8pKSBzdWJEaXIgPSAnZm9udHMvJztcbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWU/Lm1hdGNoKC9cXC4oanBlP2d8cG5nfHN2ZykkLykpIHN1YkRpciA9ICdpbWdzLyc7XG5cbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7c3ViRGlyfVtuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZWNoYXJ0cycpKSByZXR1cm4gJ2VjaGFydHMnO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA4MjAwLFxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgaHR0cHMsXG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6IEFQSV9IT1NULFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1Z1ZXRpZnlSZXNvbHZlcigpXSxcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIGxlZ2FjeSA/IHZpdGVMZWdhY3koKSA6IHVuZGVmaW5lZCxcbiAgICAgIGh0dHBzID8gbWtjZXJ0KHsgc2F2ZVBhdGg6IERFVl9NS0NFUlRfUEFUSCB9KSA6IHVuZGVmaW5lZCxcbiAgICAgIHdlYmZvbnREb3dubG9hZChbXG4gICAgICAgICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJ1YmlrOml0YWwsd2dodEAwLDMwMDswLDQwMDswLDUwMDswLDYwMDswLDcwMDsxLDMwMDsxLDQwMDsxLDUwMDsxLDYwMDsxLDcwMCZkaXNwbGF5PXN3YXAnLFxuICAgICAgXSksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGl0bGU6IGFwcE5hbWUsXG4gICAgICAgICAgICB0aGVtZUNvbG9yOiBjb2xvcnMucHJpbWFyeSxcbiAgICAgICAgICAgIGNhcHRjaGE6IHJlc29sdmVDYXB0Y2hhU2NyaXB0KGNhcHRjaGFQcm92aWRlciksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIGRpc2FibGU6IGRpc2FibGVQd2EsXG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgICAgICAgJ2ljb25zL2ljb24uc3ZnJyxcbiAgICAgICAgICAnaWNvbnMvaWNvbi5pY28nLFxuICAgICAgICAgICdpY29ucy9hcHBsZS10b3VjaC1pY29uLTE4MHgxODAucG5nJyxcbiAgICAgICAgICAncm9ib3RzLnR4dCcsXG4gICAgICAgIF0sXG4gICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgaWQ6ICcvJyxcbiAgICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgICBuYW1lOiBhcHBOYW1lLFxuICAgICAgICAgIHNob3J0X25hbWU6IGFwcE5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHBrZy5kZXNjcmlwdGlvbixcbiAgICAgICAgICB0aGVtZV9jb2xvcjogY29sb3JzLnByaW1hcnksXG4gICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAnaWNvbnMvcHdhLTY0eDY0LnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNjR4NjQnLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJ2ljb25zL3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAnaWNvbnMvcHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgIHB1cnBvc2U6ICdhbnknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAnaWNvbnMvbWFza2FibGUtaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB3b3JrYm94OiB7XG4gICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAzMDAwMDAwLFxuICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntjc3MsanMsaHRtbCxzdmcscG5nLGljbyx0eHQsd29mZjJ9J10sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcbiAgfTtcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvamFtaWUvaW50YWtlMjQvcGFja2FnZXMvY29tbW9uL3NyYy9zZWN1cml0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phbWllL2ludGFrZTI0L3BhY2thZ2VzL2NvbW1vbi9zcmMvc2VjdXJpdHkvYWNsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qYW1pZS9pbnRha2UyNC9wYWNrYWdlcy9jb21tb24vc3JjL3NlY3VyaXR5L2FjbC50c1wiO2V4cG9ydCBjb25zdCBBQ0xfUEVSTUlTU0lPTlNfS0VZID0gJ2FjbC1wZXJtaXNzaW9ucyc7XG5leHBvcnQgY29uc3QgQUNMX1JPTEVTX0tFWSA9ICdhY2wtcm9sZXMnO1xuXG5leHBvcnQgY29uc3QgcmVzcG9uZGVudFN1ZmZpeCA9ICcvcmVzcG9uZGVudCc7XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxTdXBwb3J0ID0gJ2dsb2JhbHN1cHBvcnQnO1xuXG5leHBvcnQgY29uc3Qgc3VydmV5UmVzcG9uZGVudCA9IChzdXJ2ZXlTbHVnOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgYCR7c3VydmV5U2x1Zy50b0xvd2VyQ2FzZSgpfSR7cmVzcG9uZGVudFN1ZmZpeH1gO1xuXG5leHBvcnQgY29uc3Qgc3VydmV5UGVybWlzc2lvbnMgPSAoc3VydmV5U2x1Zzogc3RyaW5nKTogc3RyaW5nW10gPT4gW3N1cnZleVJlc3BvbmRlbnQoc3VydmV5U2x1ZyldO1xuXG5leHBvcnQgY29uc3Qgc3RhbmRhcmRTZWN1cmFibGVBY3Rpb25zID0gWydyZWFkJywgJ2VkaXQnLCAnZGVsZXRlJywgJ3NlY3VyYWJsZXMnXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IHNlY3VyYWJsZURlZnMgPSB7XG4gIEZlZWRiYWNrU2NoZW1lOiBbXG4gICAgLi4uc3RhbmRhcmRTZWN1cmFibGVBY3Rpb25zLFxuICAgICdjb3B5JyxcbiAgICAndG9wLWZvb2RzJyxcbiAgICAnbWVhbHMnLFxuICAgICdjYXJkcycsXG4gICAgJ2RlbW9ncmFwaGljLWdyb3VwcycsXG4gICAgJ2hlbnJ5LWNvZWZmaWNpZW50cycsXG4gICAgJ3VzZScsXG4gIF0gYXMgY29uc3QsXG4gIExhbmd1YWdlOiBbLi4uc3RhbmRhcmRTZWN1cmFibGVBY3Rpb25zLCAndHJhbnNsYXRpb25zJywgJ3VzZSddIGFzIGNvbnN0LFxuICBMb2NhbGU6IFtcbiAgICAuLi5zdGFuZGFyZFNlY3VyYWJsZUFjdGlvbnMsXG4gICAgJ2NvcHknLFxuICAgICdmb29kLWxpc3QnLFxuICAgICdzcGxpdC1saXN0cycsXG4gICAgJ3JlY2lwZS1mb29kcycsXG4gICAgJ3NwbGl0LXdvcmRzJyxcbiAgICAnc3lub255bS1zZXRzJyxcbiAgICAndGFza3MnLFxuICAgICd1c2UnLFxuICBdIGFzIGNvbnN0LFxuICBTdXJ2ZXlTY2hlbWU6IFsuLi5zdGFuZGFyZFNlY3VyYWJsZUFjdGlvbnMsICdjb3B5JywgJ3Byb21wdHMnLCAnZGF0YS1leHBvcnQnLCAndXNlJ10gYXMgY29uc3QsXG4gIFN1cnZleTogW1xuICAgIC4uLnN0YW5kYXJkU2VjdXJhYmxlQWN0aW9ucyxcbiAgICAnb3ZlcnJpZGVzJyxcbiAgICAncmVzcG9uZGVudHMnLFxuICAgICdzdWJtaXNzaW9ucycsXG4gICAgJ3N1cHBvcnQnLFxuICAgICd0YXNrcycsXG4gIF0gYXMgY29uc3QsXG59O1xuXG5leHBvcnQgdHlwZSBTZWN1cmFibGVUeXBlID0ga2V5b2YgdHlwZW9mIHNlY3VyYWJsZURlZnM7XG5cbmV4cG9ydCBjb25zdCBzZWN1cmFibGVUeXBlcyA9IE9iamVjdC5rZXlzKHNlY3VyYWJsZURlZnMpIGFzIFNlY3VyYWJsZVR5cGVbXTtcblxuZXhwb3J0IHR5cGUgRmVlZGJhY2tTY2hlbWVTZWN1cmFibGVBY3Rpb25zID0gKHR5cGVvZiBzZWN1cmFibGVEZWZzLkZlZWRiYWNrU2NoZW1lKVtudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBTdXJ2ZXlTY2hlbWVTZWN1cmFibGVBY3Rpb25zID0gKHR5cGVvZiBzZWN1cmFibGVEZWZzLlN1cnZleVNjaGVtZSlbbnVtYmVyXTtcblxuZXhwb3J0IHR5cGUgU3VydmV5U2VjdXJhYmxlQWN0aW9ucyA9ICh0eXBlb2Ygc2VjdXJhYmxlRGVmcy5TdXJ2ZXkpW251bWJlcl07XG5cbmV4cG9ydCBjb25zdCBpc1NlY3VyYWJsZVR5cGUgPSAodHlwZTogYW55KTogdHlwZSBpcyBTZWN1cmFibGVUeXBlID0+IHNlY3VyYWJsZVR5cGVzLmluY2x1ZGVzKHR5cGUpO1xuXG5leHBvcnQgY29uc3QgcmVjb3JkVmlzaWJpbGl0aWVzID0gWydwdWJsaWMnLCAncmVzdHJpY3RlZCddIGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBSZWNvcmRWaXNpYmlsaXR5ID0gKHR5cGVvZiByZWNvcmRWaXNpYmlsaXRpZXMpW251bWJlcl07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qYW1pZS9pbnRha2UyNC9wYWNrYWdlcy9jb21tb24vc3JjL3NlY3VyaXR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvamFtaWUvaW50YWtlMjQvcGFja2FnZXMvY29tbW9uL3NyYy9zZWN1cml0eS9jYXB0Y2hhLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qYW1pZS9pbnRha2UyNC9wYWNrYWdlcy9jb21tb24vc3JjL3NlY3VyaXR5L2NhcHRjaGEudHNcIjtleHBvcnQgY29uc3QgY2FwdGNoYVByb3ZpZGVycyA9IFsnaC1jYXB0Y2hhJywgJ3JlLWNhcHRjaGEnXSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgQ2FwdGNoYVByb3ZpZGVyID0gKHR5cGVvZiBjYXB0Y2hhUHJvdmlkZXJzKVtudW1iZXJdO1xuXG5leHBvcnQgY29uc3QgaXNDYXB0Y2hhUHJvdmlkZXIgPSAocHJvdmlkZXI6IGFueSk6IHByb3ZpZGVyIGlzIENhcHRjaGFQcm92aWRlciA9PlxuICBjYXB0Y2hhUHJvdmlkZXJzLmluY2x1ZGVzKHByb3ZpZGVyKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVDYXB0Y2hhU2NyaXB0ID0gKHByb3ZpZGVyOiBDYXB0Y2hhUHJvdmlkZXIpID0+IHtcbiAgc3dpdGNoIChwcm92aWRlcikge1xuICAgIGNhc2UgJ2gtY2FwdGNoYSc6XG4gICAgICByZXR1cm4gYDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cImh0dHBzOi8vanMuaGNhcHRjaGEuY29tLzEvYXBpLmpzXCIgYXN5bmMgZGVmZXI+PC9zY3JpcHQ+YDtcbiAgICBjYXNlICdyZS1jYXB0Y2hhJzpcbiAgICAgIHJldHVybiBgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvYXBpLmpzP29ubG9hZD12dWVSZWNhcHRjaGFBcGlMb2FkZWQmcmVuZGVyPWV4cGxpY2l0XCIgYXN5bmMgZGVmZXI+PC9zY3JpcHQ+YDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvamFtaWUvaW50YWtlMjQvcGFja2FnZXMvY29tbW9uL3NyYy90aGVtZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phbWllL2ludGFrZTI0L3BhY2thZ2VzL2NvbW1vbi9zcmMvdGhlbWUvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2phbWllL2ludGFrZTI0L3BhY2thZ2VzL2NvbW1vbi9zcmMvdGhlbWUvaW5kZXgudHNcIjtleHBvcnQgY29uc3QgY29sb3JzID0ge1xuICBwcmltYXJ5OiAnI0VFNjcyRCcsXG4gIHNlY29uZGFyeTogJyMwMjAyMDInLFxuICB0ZXJuYXJ5OiAnI0ZFRThFMScsXG4gIHF1YXRlcm5hcnk6ICcjRDM0OTgwJyxcbiAgYWNjZW50OiAnI0Y2ODYyMycsXG4gIGluZm86ICcjNDQ1NkE2JyxcbiAgJ2luZm8tMic6ICcjNzdDMDQ0JyxcbiAgJ2luZm8tMyc6ICcjQjk2OERDJyxcbiAgJ2luZm8tNCc6ICcjNDFDM0VDJyxcbiAgJ2luZm8tNSc6ICcjRkZEQjU5Jyxcbn07XG4iLCAie1xuICBcIm5hbWVcIjogXCJAaW50YWtlMjQvc3VydmV5XCIsXG4gIFwidmVyc2lvblwiOiBcIjIwMjQuMS4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJJbnRha2UyNCBTdXJ2ZXkgQXBwXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcImxpY2Vuc2VcIjogXCJBcGFjaGUtMi4wXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTVJDLUVwaWQtaXQyNC9pbnRha2UyNC5naXRcIixcbiAgICBcImRpcmVjdG9yeVwiOiBcImFwcHMvc3VydmV5XCJcbiAgfSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgXCJidWlsZFwiOiBcInBucG0gYnVpbGQtb25seVwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlldyAtLXBvcnQgNDE3M1wiLFxuICAgIFwiYnVpbGQtb25seVwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImdlbmVyYXRlLXB3YS1hc3NldHNcIjogXCJwd2EtYXNzZXRzLWdlbmVyYXRvclwiLFxuICAgIFwic3RhcnRcIjogXCJub2RlIHNlcnZlci9pbmRleC5qc1wiLFxuICAgIFwidHlwZS1jaGVja1wiOiBcInZ1ZS10c2MgLS1ub0VtaXRcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLiAtLWV4dCAudnVlLC5qcywuanN4LC5janMsLm1qcywudHMsLnRzeCwuY3RzLC5tdHMgLS1maXggLS1pZ25vcmUtcGF0aCAuLi8uLi8uZXNsaW50aWdub3JlXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGNvZGRpY2F0L3Z1ZS1waW5jaC1zY3JvbGwtem9vbVwiOiBcIl4zLjMuNFwiLFxuICAgIFwiQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWVcIjogXCJeNi41LjFcIixcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIl4xMC43LjJcIixcbiAgICBcImF3ZXNvbWUtcGhvbmVudW1iZXJcIjogXCJeNi40LjBcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNi43XCIsXG4gICAgXCJheGlvcy1yZXRyeVwiOiBcIl40LjAuMFwiLFxuICAgIFwiZG90ZW52XCI6IFwiXjE2LjQuNFwiLFxuICAgIFwiZG90ZW52LWV4cGFuZFwiOiBcIl4xMS4wLjZcIixcbiAgICBcImV4cHJlc3NcIjogXCJeNC4xOC4yXCIsXG4gICAgXCJmbGFnLWljb25zXCI6IFwiXjcuMS4wXCIsXG4gICAgXCJoZWxtZXRcIjogXCJeNy4xLjBcIixcbiAgICBcImxvZGFzaFwiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJwaW5pYVwiOiBcIl4yLjEuN1wiLFxuICAgIFwicGluaWEtcGx1Z2luLXBlcnNpc3RlZHN0YXRlXCI6IFwiXjMuMi4xXCIsXG4gICAgXCJ1dWlkXCI6IFwiXjkuMC4xXCIsXG4gICAgXCJ2dWVcIjogXCJeMi43LjE2XCIsXG4gICAgXCJ2dWUtZ3RhZ1wiOiBcIl4xLjE2LjFcIixcbiAgICBcInZ1ZS1pMThuXCI6IFwiXjguMjguMlwiLFxuICAgIFwidnVlLXJvdXRlclwiOiBcIl4zLjYuNVwiLFxuICAgIFwidnVldGlmeVwiOiBcIl4yLjcuMlwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0eXBlcy9qc2RvbVwiOiBcIl4yMS4xLjZcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2hcIjogXCJeNC4xNC4yMDJcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjExLjE5XCIsXG4gICAgXCJAdHlwZXMvdXVpZFwiOiBcIl45LjAuOFwiLFxuICAgIFwiQHZpdGUtcHdhL2Fzc2V0cy1nZW5lcmF0b3JcIjogXCJeMC4yLjRcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLWxlZ2FjeVwiOiBcIl41LjMuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlMlwiOiBcIl4yLjMuMVwiLFxuICAgIFwiQHZ1ZS9lc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMC4wXCIsXG4gICAgXCJAdnVlL2VzbGludC1jb25maWctdHlwZXNjcmlwdFwiOiBcIl4xMi4wLjBcIixcbiAgICBcImVzbGludFwiOiBcIl44LjU2LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjkuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1zaW1wbGUtaW1wb3J0LXNvcnRcIjogXCJeMTIuMC4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjIxLjFcIixcbiAgICBcImpzZG9tXCI6IFwiXjI0LjAuMFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy4yLjVcIixcbiAgICBcInNhc3NcIjogXCJ+MS4zMi4xM1wiLFxuICAgIFwidGVyc2VyXCI6IFwiXjUuMjcuMlwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjMuM1wiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNi4wXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMS4zXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1odG1sXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIjogXCJeMS4xNy4zXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1wd2FcIjogXCJeMC4xOS4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi13ZWJmb250LWRsXCI6IFwiXjMuOS4xXCIsXG4gICAgXCJ2aXRlc3RcIjogXCJeMS4zLjBcIixcbiAgICBcInZ1ZS10c2NcIjogXCJeMS44LjI3XCIsXG4gICAgXCJ3b3JrYm94LXdpbmRvd1wiOiBcIl43LjAuMFwiXG4gIH0sXG4gIFwiYnVuZGxlZERlcGVuZGVuY2llc1wiOiBbXG4gICAgXCJAaW50YWtlMjQvc3VydmV5XCIsXG4gICAgXCJAaW50YWtlMjQvY29tbW9uXCIsXG4gICAgXCJAaW50YWtlMjQvaTE4blwiLFxuICAgIFwiQGludGFrZTI0L3VpXCJcbiAgXVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixPQUFPLGtCQUFrQjtBQUM5UyxTQUFTLGVBQWUsV0FBVztBQUVuQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFNBQVM7QUFDaEIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTtBQUN4QixPQUFPLHFC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
