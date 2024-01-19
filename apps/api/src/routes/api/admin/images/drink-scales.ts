import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/drinkware-sets/scale';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, drinkScaleController } = ioc.cradle;
  const router = Router({ mergeParams: true });
  const upload = multer({ dest: fsConfig.local.uploads });

  router
    .route('')
    .get(permission('drinkware-sets|browse'), wrapAsync(drinkScaleController.browse))
    .delete(permission('drinkware-sets|delete'), wrapAsync(drinkScaleController.destroyAll));

  router
    .route('/:choiceId')
    .get(permission('drinkware-sets|read'), validation.read, wrapAsync(drinkScaleController.read))
    .post(
      permission('drinkware-sets|create'),
      upload.single('image'),
      validation.store,
      wrapAsync(drinkScaleController.store)
    )

    .delete(permission('drinkware-sets|delete'), wrapAsync(drinkScaleController.destroy));

  return router;
};
