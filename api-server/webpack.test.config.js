/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { exec } = require('child_process');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;
const isDev = NODE_ENV === 'development';

const plugins = [
  {
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
        exec('npm run --silent test:run', (err, stdout, stderr) => {
          if (stdout) process.stdout.write(stdout);
          if (stderr) process.stderr.write(stderr);
        });
      });
    },
  },
];

module.exports = {
  entry: path.resolve('./tests/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist-tests'),
    filename: 'tests.js',
  },
  mode: NODE_ENV,
  target: 'node',
  watch: true,
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
