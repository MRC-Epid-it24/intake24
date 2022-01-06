/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');

// Set default template's values when variables not loaded from .env file
process.env.VUE_APP_RECAPTCHA_ENABLED = process.env.VUE_APP_RECAPTCHA_ENABLED || 'false';

// Set build info for application
process.env.VUE_APP_BUILD_VERSION = pkg.version;
process.env.VUE_APP_BUILD_REVISION = childProcess
  .execSync('git rev-parse --short HEAD', { cwd: path.resolve(__dirname, '..') })
  .toString()
  .trim();
process.env.VUE_APP_BUILD_DATE = new Date().toISOString();

module.exports = {
  configureWebpack: {
    plugins: process.env.WEBPACK_ANALYZE_BUNDLE === 'true' ? [new BundleAnalyzerPlugin()] : [],
    resolve: {
      alias: {
        '@common': path.resolve(__dirname, '../../packages/common/src'),
        '@intake24/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
      },
    },
  },
  devServer: {
    port: 8200,
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  outputDir: process.env.OUTPUT_DIR || 'dist',
  publicPath: process.env.PUBLIC_PATH || '/',
  pwa: {
    name: process.env.VUE_APP_NAME,
    themeColor: '#263238',
    msTileColor: '#FFFFFF',
    manifestOptions: {
      name: process.env.VUE_APP_NAME,
      short_name: process.env.VUE_APP_NAME,
      start_url: '.',
      display: 'standalone',
      theme_color: '#263238',
      background_color: '#FFFFFF',
    },
  },
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
};
