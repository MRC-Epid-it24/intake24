/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand(env);

const express = require('express');
const helmet = require('helmet');
const path = require('path');

const config = require('./config');

const startApp = async () => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", config.api.host],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: [
            "'self'",
            'https://www.google.com',
            'https://youtube.com',
            'https://www.youtube.com',
            'https://*.duosecurity.com',
          ],
          imgSrc: ["'self'", 'blob:', 'data:', config.api.host],
          scriptSrc: [
            "'self'",
            'https://storage.googleapis.com',
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',
          ],
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            'https://www.google.com/recaptcha/',
            'https://recaptcha.google.com/recaptcha/',
            "'unsafe-inline'", // TODO: review for Vuetify theming
          ],
        },
      },
    })
  );

  app.use(express.static(config.static, { index: false }));

  app.get('*', (req, res) => res.sendFile(path.resolve(config.static, 'index.html')));

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
