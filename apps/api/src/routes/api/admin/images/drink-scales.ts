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
    .get(permission('drinkware-sets:browse'), wrapAsync(drinkScaleController.browse))
    .delete(permission('drinkware-sets:delete'), wrapAsync(drinkScaleController.destroyAll));

  router
    .route('/:choiceId')
    .get(permission('drinkware-sets:read'), validation.read, wrapAsync(drinkScaleController.read))
    .delete(permission('drinkware-sets:delete'), wrapAsync(drinkScaleController.destroy));

  router.route('/:choiceId/v1').post(
    permission('drinkware-sets:create'),
    upload.fields([
      { name: 'baseImage', maxCount: 1 },
      { name: 'overlayImage', maxCount: 1 },
    ]),
    validation.storeV1,
    wrapAsync(drinkScaleController.storeV1),
  );

  router
    .route('/:choiceId/v2')
    .post(
      permission('drinkware-sets:create'),
      upload.single('image'),
      validation.storeV2,
      wrapAsync(drinkScaleController.storeV2),
    );

  return router;
};
