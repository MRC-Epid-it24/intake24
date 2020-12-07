import type { Express } from 'express';
import type { Ops } from '@/app';
import { isUrlAbsolute } from '@/util';
import api from './api';
import sites from './sites';

export default (app: Express, { config }: Ops): void => {
  // API
  app.use('/api', api);

  // Register sites if they are locally hosted / relative URLs
  Object.entries(config.app.urls).forEach(([site, url]) => {
    if (!isUrlAbsolute(url)) app.use(url, sites[site]);
  });

  /*
   * TODO: keep root for static / portal content
   * TEMP: redirect to survey app for now
   */
  if (!isUrlAbsolute(config.app.urls.survey))
    app.get('*', (req, res) => res.redirect(config.app.urls.survey));
};
