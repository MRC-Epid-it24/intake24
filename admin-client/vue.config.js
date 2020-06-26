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
    port: 8100,
    proxy: {
      '/v1': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        pathRewrite: { '^/v1': '' },
      },
      '/v2': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/v3': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        pathRewrite: { '^/v3': '' },
      },
    },
  },
  outputDir: process.env.SERVER_STATIC || 'dist',
  transpileDependencies: ['vuetify'],
};
