import type { Express } from 'express';
import helmet from 'helmet';
import type { Site } from '@intake24/api/config';
import type { Ops } from '@intake24/api/app';
import { isUrlAbsolute } from '@intake24/api/util';
import api from './api';
import sites from './sites';

export default (app: Express, { config }: Ops): void => {
  /*
   * API routes
   * - exclude CSP
   */
  app.use('/api', helmet({ contentSecurityPolicy: false }), api);

  /*
   * Static sites
   * - include CSP for static sites
   */
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: [
            "'self'",
            'https://www.google.com',
            'https://youtube.com',
            'https://www.youtube.com',
          ],
          imgSrc: ["'self'", 'blob:', 'data:'],
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

  // Sites
  const { urls } = config.app;

  // Register sites if they are locally hosted / relative URLs
  Object.entries(sites).forEach(([site, route]) => {
    if (!isUrlAbsolute(urls[site as Site])) app.use(urls[site as Site], route);
  });

  /*
   * TODO: keep root for static / portal content
   * TEMP: redirect to survey app for now
   */
  if (!isUrlAbsolute(urls.survey)) app.get('*', (req, res) => res.redirect(urls.survey));
};
