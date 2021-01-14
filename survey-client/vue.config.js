/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  configureWebpack: {
    plugins: process.env.WEBPACK_ANALYZE_BUNDLE === 'true' ? [new BundleAnalyzerPlugin()] : [],
    resolve: {
      alias: {
        '@common': path.resolve(__dirname, '../common/src/'),
      },
    },
  },
  devServer: {
    port: 8200,
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
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
  transpileDependencies: ['vuetify'],
};
