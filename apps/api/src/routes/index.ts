import type { Express } from 'express';
import type { Site } from '@api/config';
import type { Ops } from '@api/app';
import { isUrlAbsolute } from '@api/util';
import api from './api';
import sites from './sites';

export default (app: Express, { config }: Ops): void => {
  // API
  app.use('/api', api);

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
