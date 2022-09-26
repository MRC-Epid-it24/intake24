import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/nutrient-units';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { nutrientUnitController } = ioc.cradle;
  const router = Router();

  router.use(permission('nutrient-units'));

  router
    .route('')
    .post(
      permission('nutrient-units|create'),
      validation.store,
      wrapAsync(nutrientUnitController.store)
    )
    .get(
      permission('nutrient-units|browse'),
      validation.browse,
      wrapAsync(nutrientUnitController.browse)
    );

  router.get('/refs', wrapAsync(nutrientUnitController.refs));

  router
    .route('/:nutrientUnitId')
    .get(permission('nutrient-units|read'), wrapAsync(nutrientUnitController.read))
    .put(
      permission('nutrient-units|edit'),
      validation.update,
      wrapAsync(nutrientUnitController.update)
    )
    .delete(permission('nutrient-units|delete'), wrapAsync(nutrientUnitController.destroy));

  router.get(
    '/:nutrientUnitId/edit',
    permission('nutrient-units|edit'),
    wrapAsync(nutrientUnitController.edit)
  );

  return router;
};
