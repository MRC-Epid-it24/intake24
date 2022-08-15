import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/drinkware-sets';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { drinkwareSetController } = ioc.cradle;
  const router = Router();

  router.use(permission('drinkware-sets'));

  router
    .route('')
    .post(
      permission('drinkware-sets|create'),
      validation.store,
      wrapAsync(drinkwareSetController.store)
    )
    .get(
      permission('drinkware-sets|browse'),
      validation.browse,
      wrapAsync(drinkwareSetController.browse)
    );

  router.get('/refs', wrapAsync(drinkwareSetController.refs));

  router
    .route('/:drinkwareSetId')
    .get(permission('drinkware-sets|read'), wrapAsync(drinkwareSetController.read))
    .put(
      permission('drinkware-sets|edit'),
      validation.update,
      wrapAsync(drinkwareSetController.update)
    )
    .delete(permission('drinkware-sets|delete'), wrapAsync(drinkwareSetController.destroy));

  router.get(
    '/:drinkwareSetId/edit',
    permission('drinkware-sets|edit'),
    wrapAsync(drinkwareSetController.edit)
  );

  return router;
};
