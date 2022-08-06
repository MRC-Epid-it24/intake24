import { Router } from 'express';

import validation from '@intake24/api/http/requests/i18n';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { userI18nController } = ioc.cradle;

  const router = Router();

  router.get('', wrapAsync(userI18nController.browse));
  router.get('/:languageId', validation.entry, wrapAsync(userI18nController.entry));

  return router;
};
