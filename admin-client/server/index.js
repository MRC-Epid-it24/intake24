/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand(env);

const express = require('express');
const helmet = require('helmet');
const { nanoid } = require('nanoid');
const nunjucks = require('nunjucks');

const config = require('./config');

const startApp = async () => {
  const app = express();

  app.use((req, res, next) => {
    res.locals.nonce = { recaptcha: nanoid() };
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", config.api.host],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: ["'self'", 'https://www.google.com', 'https://*.duosecurity.com'],
          imgSrc: ["'self'", 'blob:', config.api.host],
          scriptSrc: [
            "'self'",
            'https://storage.googleapis.com',
            (req, res) => `'nonce-${res.locals.nonce.recaptcha}'`,
          ],
          styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        },
      },
    })
  );

  nunjucks.configure(config.static, { autoescape: true, express: app });

  app.use(express.static(config.static, { index: false }));

  app.get('*', (req, res) => res.render('index.html'));

  // Start listening
  app.listen(config.port, config.url, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`${config.name} is listening on port ${config.port}!`);
  });
};

startApp();
