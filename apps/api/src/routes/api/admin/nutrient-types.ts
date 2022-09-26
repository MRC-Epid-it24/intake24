import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/nutrient-types';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { nutrientTypeController } = ioc.cradle;
  const router = Router();

  router.use(permission('nutrient-types'));

  router
    .route('')
    .post(
      permission('nutrient-types|create'),
      validation.store,
      wrapAsync(nutrientTypeController.store)
    )
    .get(
      permission('nutrient-types|browse'),
      validation.browse,
      wrapAsync(nutrientTypeController.browse)
    );

  router.get('/refs', wrapAsync(nutrientTypeController.refs));

  router
    .route('/:nutrientTypeId')
    .get(permission('nutrient-types|read'), wrapAsync(nutrientTypeController.read))
    .put(
      permission('nutrient-types|edit'),
      validation.update,
      wrapAsync(nutrientTypeController.update)
    )
    .delete(permission('nutrient-types|delete'), wrapAsync(nutrientTypeController.destroy));

  router.get(
    '/:nutrientTypeId/edit',
    permission('nutrient-types|edit'),
    wrapAsync(nutrientTypeController.edit)
  );

  return router;
};
