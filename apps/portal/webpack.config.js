const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = (env) => {
  const { NODE_ENV = 'development' } = env;
  const isDev = NODE_ENV === 'development';

  const plugins = [new ForkTsCheckerWebpackPlugin(), new WebpackBar({ name: 'Portal' })];

  if (isDev)
    plugins.push(
      new NodemonPlugin({
        script: './dist/server.js',
        watch: path.resolve('./dist'),
        nodeArgs: ['--trace-warnings', '--inspect=5959'],
      })
    );

  return {
    context: __dirname,
    entry: {
      server: path.resolve('./src/index.ts'),
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
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins,
  };
};
