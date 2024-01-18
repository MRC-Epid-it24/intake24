import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/as-served-images';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, drinkScaleController } = ioc.cradle;
  const router = Router({ mergeParams: true });
  const upload = multer({ dest: fsConfig.local.uploads });

  router
    .route('')
    /*.post(
      permission('drinkware-sets|create'),
      upload.single('image'),
      validation.store,
      wrapAsync(drinkScaleController.store)
    )*/
    .get(
      permission('drinkware-sets|browse'),
      validation.browse,
      wrapAsync(drinkScaleController.browse)
    );
  //.delete(permission('drinkware-sets|delete'), wrapAsync(drinkScaleController.destroyAll));

  /*
  router
    .route('/:scaleId')
    .get(permission('drinkware-sets|read'), wrapAsync(drinkScaleController.read))
    .delete(permission('drinkware-sets|delete'), wrapAsync(drinkScaleController.destroy));
   */

  return router;
};
