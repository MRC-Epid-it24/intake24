import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import securables from '../securables';
import recipeFoods from './recipe-foods';
import splitLists from './split-lists';
import splitWords from './split-words';
import synonymSets from './synonym-sets';

export default () => {
  const { localeController, fsConfig } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('locales'));

  router
    .route('')
    .post(permission('locales|create'), validation.store, wrapAsync(localeController.store))
    .get(validation.browse, wrapAsync(localeController.browse));

  router.get('/refs', wrapAsync(localeController.refs));
  router.get('/by-code/:code', validation.code('code'), wrapAsync(localeController.getByCode));

  router.use('/:localeId', validation.entry('localeId'));

  router
    .route('/:localeId')
    .get(wrapAsync(localeController.read))
    .put(validation.update, wrapAsync(localeController.update))
    .delete(wrapAsync(localeController.destroy));

  router.get('/:localeId/edit', wrapAsync(localeController.edit));
  router.post(
    '/:localeId/tasks',
    upload.single('params[file]'),
    validation.tasks,
    wrapAsync(localeController.tasks)
  );

  router.use('/:localeId/recipe-foods', recipeFoods());
  router.use('/:localeId/split-lists', splitLists());
  router.use('/:localeId/split-words', splitWords());
  router.use('/:localeId/synonym-sets', synonymSets());
  router.use('/:localeId/securables', securables('Locale', localeController.securables));

  return router;
};
