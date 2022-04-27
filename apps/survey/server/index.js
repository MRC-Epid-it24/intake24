/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand.expand(env);

const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

const config = require('./config');
const appRoutes = require('./routes/app');
const siteRoutes = require('./routes/site');

const startApp = () => {
  const app = express();

  // Security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", config.api.host],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
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
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  // Templating engine
  nunjucks.configure(`${__dirname}/views`, { autoescape: true, express: app });

  // Base static public path
  app.use(express.static(config.static, { index: false }));

  // Survey App
  app.use(config.app.namespace, appRoutes);

  // Register static site pages if enabled
  if (config.site.enable && !['', '/'].includes(config.app.namespace)) app.use('', siteRoutes);

  // Error middleware
  app.use((err, req, res, next) => {
    const { message, name, stack } = err;
    console.error(stack || `${name}: ${message}`);
    res.status(500).render('errors/500.html');
  });

  // Start listening
  app.listen(config.port, config.url, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${config.name} is listening on port ${config.port}!`);
  });
};

startApp();
