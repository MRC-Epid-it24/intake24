/* eslint-disable @typescript-eslint/no-var-requires */
const mix = require('laravel-mix');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand(env);

const publicPath = process.env.SERVER_STATIC;

mix
  .disableNotifications()
  .setPublicPath(publicPath)
  .scripts(
    [
      'node_modules/jquery/dist/jquery.slim.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
    ],
    `${publicPath}/site.js`
  )
  .sass('server/assets/scss/site.scss', `${publicPath}/site.css`)
  .copy('server/assets/images', `${publicPath}/images`)
  .copy('server/assets/output-samples', `${publicPath}/output-samples`)
  .copy('server/assets/papers', `${publicPath}/papers`);
