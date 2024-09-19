import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/as-served-sets';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import asServedImages from './as-served-images';

export default () => {
  const { fsConfig, asServedSetController } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('as-served-sets'));

  router
    .route('')
    .post(
      permission('as-served-sets|create'),
      upload.single('selectionImage'),
      validation.store,
      wrapAsync(asServedSetController.store),
    )
    .get(
      permission('as-served-sets|browse'),
      validation.browse,
      wrapAsync(asServedSetController.browse),
    );

  router.get('/refs', wrapAsync(asServedSetController.refs));

  router
    .route('/:asServedSetId')
    .get(permission('as-served-sets|read'), wrapAsync(asServedSetController.read))
    .put(
      permission('as-served-sets|edit'),
      validation.update,
      wrapAsync(asServedSetController.update),
    )
    .delete(permission('as-served-sets|delete'), wrapAsync(asServedSetController.destroy));

  router.use('/:asServedSetId/images', asServedImages());

  return router;
};
