import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/as-served-images';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, asServedImageController } = ioc.cradle;
  const router = Router({ mergeParams: true });
  const upload = multer({ dest: fsConfig.local.uploads });

  router
    .route('')
    .post(
      permission('as-served-sets|create'),
      upload.single('image'),
      validation.store,
      wrapAsync(asServedImageController.store)
    )
    .get(
      permission('as-served-sets|browse'),
      validation.browse,
      wrapAsync(asServedImageController.browse)
    )
    .delete(permission('as-served-sets|delete'), wrapAsync(asServedImageController.destroyAll));

  router
    .route('/:asServedImageId')
    .get(permission('as-served-sets|read'), wrapAsync(asServedImageController.read))
    .delete(permission('as-served-sets|delete'), wrapAsync(asServedImageController.destroy));

  return router;
};
