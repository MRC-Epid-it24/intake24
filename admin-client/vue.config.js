/* eslint-disable @typescript-eslint/no-var-requires */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  configureWebpack: {
    plugins: process.env.WEBPACK_ANALYZE_BUNDLE === 'true' ? [new BundleAnalyzerPlugin()] : [],
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
