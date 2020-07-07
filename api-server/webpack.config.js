/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ShellPlugin = require('webpack-shell-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const {NODE_ENV = 'development'} = process.env;
const isDev = NODE_ENV === 'development';

const plugins = [];

if (isDev) {
  plugins.push(new ShellPlugin({onBuildEnd: ['npm run development:start']}));
}

module.exports = {
  entry: {
    server: path.resolve('./src/index.ts'),
    foodIndexBuilder: path.resolve('./src/food-index/workers/index-builder.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: NODE_ENV,
  target: 'node',
  watch: isDev,
  devtool: isDev ? 'source-map' : undefined,
  optimization: {
    minimize: false,
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        logLevel: 'info',
        logInfoToStdOut: true,
        extensions: ['.ts'],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: plugins
};
