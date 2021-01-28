/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;
const isDev = NODE_ENV === 'development';

const plugins = [];

if (isDev)
  plugins.push(
    new NodemonPlugin({
      script: './dist/server.js',
      watch: path.resolve('./dist'),
      nodeArgs: ['--trace-warnings', '--inspect=5959'],
    })
  );

module.exports = {
  context: __dirname,
  entry: {
    server: path.resolve('./src/index.ts'),
    foodIndexBuilder: path.resolve('./src/food-index/workers/index-builder.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: NODE_ENV,
  target: 'node',
  watch: isDev,
  watchOptions: { ignored: ['node_modules/**', 'public/**'] },
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
      },
    ],
  },
  plugins,
};
