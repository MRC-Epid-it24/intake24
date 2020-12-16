/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;
const isDev = NODE_ENV === 'development';

const plugins = [];

module.exports = {
  context: __dirname,
  entry: {
    findPortionSizes: path.resolve('./src/find-portion-sizes.ts'),
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
  externals: [nodeExternals({
    additionalModuleDirs: ['../api-server/node_modules']
  })],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.build.json',
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
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.build.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins,
};
