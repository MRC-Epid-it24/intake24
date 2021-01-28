const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config({ path: `${__dirname}/.env-test` });
dotenvExpand(env);

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { exec } = require('child_process');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;
const isDev = NODE_ENV === 'development';

const plugins = [
  {
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        exec('npm run --silent test:unit:run', (err, stdout, stderr) => {
          if (stdout) process.stdout.write(stdout);
          if (stderr) process.stderr.write(stderr);
        });
      });
    },
  },
];

module.exports = {
  entry: path.resolve(__dirname, 'unit/index.ts'),
  output: {
    path: path.resolve(__dirname, '../dist-tests'),
    filename: 'tests.js',
  },
  mode: ['production', 'development'].includes(NODE_ENV) ? NODE_ENV : 'none',
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
        configFile: path.resolve(__dirname, 'tsconfig.json'),
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
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins,
};
