/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand.expand(env);

const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');

const config = require('./config');

const startApp = async () => {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", 'https://hcaptcha.com', 'https://*.hcaptcha.com', config.api.host],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: [
            "'self'",
            'https://hcaptcha.com',
            'https://*.hcaptcha.com',
            'https://www.google.com/recaptcha/',
            'https://recaptcha.google.com/recaptcha/',
            'https://youtube.com',
            'https://www.youtube.com',
          ],
          imgSrc: ["'self'", 'blob:', 'data:', config.api.host, config.api.cdn],
          scriptSrc: [
            "'self'",
            'https://hcaptcha.com',
            'https://*.hcaptcha.com',
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',
            'https://storage.googleapis.com',
          ],
          styleSrc: [
            "'self'",
            'https://hcaptcha.com',
            'https://*.hcaptcha.com',
            'https://fonts.googleapis.com',
            "'unsafe-inline'", // TODO: review for Vuetify theming
          ],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  app.use(express.static(config.static, { index: false }));

  app.get('*', (req, res) => {
    const index = path.resolve(config.static, 'index.html');

    fs.access(index, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send();
        return;
      }

      res.sendFile(index);
    });
  });

  // Start listening
  app.listen(config.port, config.url, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`${config.name} is listening on port ${config.port}!`);
  });
};

(async () => {
  await startApp();
})();
