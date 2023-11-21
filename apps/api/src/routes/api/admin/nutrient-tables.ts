import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/nutrient-tables';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, nutrientTableController } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('nutrient-tables'));

  router
    .route('')
    .post(
      permission('nutrient-tables|create'),
      validation.store,
      wrapAsync(nutrientTableController.store)
    )
    .get(
      permission('nutrient-tables|browse'),
      validation.browse,
      wrapAsync(nutrientTableController.browse)
    );

  router.get('/refs', wrapAsync(nutrientTableController.refs));

  router
    .route('/:nutrientTableId')
    .get(permission('nutrient-tables|read'), wrapAsync(nutrientTableController.read))
    .put(
      permission('nutrient-tables|edit'),
      validation.update,
      wrapAsync(nutrientTableController.update)
    )
    .delete(permission('nutrient-tables|delete'), wrapAsync(nutrientTableController.destroy));

  router.get(
    '/:nutrientTableId/edit',
    permission('nutrient-tables|edit'),
    wrapAsync(nutrientTableController.edit)
  );

  router.post(
    '/:nutrientTableId/tasks',
    upload.single('params[file]'),
    permission('nutrient-tables|tasks'),
    validation.tasks,
    wrapAsync(nutrientTableController.tasks)
  );

  return router;
};
