import config from '@/config/app';
import { AppLoader } from '@/loaders/loader';
import { isUrlAbsolute } from '@/util/url';
import api from './api';
import sites from './sites';

export default ({ app }: AppLoader): void => {
  // API
  app.use('/api', api);

  // Register sites if they are locally hosted / relative URLs
  Object.entries(config.urls).forEach(([site, url]) => {
    if (!isUrlAbsolute(url)) app.use(url, sites[site]);
  });

  /*
   * TODO: keep root for static / portal content
   * TEMP: redirect to survey app for now
   */
  if (!isUrlAbsolute(config.urls.survey))
    app.get('*', (req, res) => res.redirect(config.urls.survey));
};
