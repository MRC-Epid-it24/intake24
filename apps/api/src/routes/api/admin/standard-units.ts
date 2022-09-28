import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/standard-units';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { standardUnitController } = ioc.cradle;
  const router = Router();

  router.use(permission('standard-units'));

  router
    .route('')
    .post(
      permission('standard-units|create'),
      validation.store,
      wrapAsync(standardUnitController.store)
    )
    .get(
      permission('standard-units|browse'),
      validation.browse,
      wrapAsync(standardUnitController.browse)
    );

  router.get('/refs', wrapAsync(standardUnitController.refs));

  router
    .route('/:standardUnitId')
    .get(permission('standard-units|read'), wrapAsync(standardUnitController.read))
    .put(
      permission('standard-units|edit'),
      validation.update,
      wrapAsync(standardUnitController.update)
    )
    .delete(permission('standard-units|delete'), wrapAsync(standardUnitController.destroy));

  router.get(
    '/:standardUnitId/edit',
    permission('standard-units|edit'),
    wrapAsync(standardUnitController.edit)
  );

  router.get(
    '/:standardUnitId/categories',
    permission('standard-units|categories'),
    validation.browse,
    wrapAsync(standardUnitController.categories)
  );

  router.get(
    '/:standardUnitId/foods',
    permission('standard-units|foods'),
    validation.browse,
    wrapAsync(standardUnitController.foods)
  );

  return router;
};
