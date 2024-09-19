import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/drinkware-sets';
import parseBaseImages from '@intake24/api/http/requests/admin/images/drinkware-sets/parse-base-images';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import bodyJsonField from '@intake24/api/util/body-json-field';

import drinkScales from './drink-scales';

export default () => {
  const { fsConfig, drinkwareSetController } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('drinkware-sets'));

  router
    .route('')
    .post(
      permission('drinkware-sets|create'),
      validation.store,
      wrapAsync(drinkwareSetController.store),
    )
    .get(
      permission('drinkware-sets|browse'),
      validation.browse,
      wrapAsync(drinkwareSetController.browse),
    );

  router.get('/refs', wrapAsync(drinkwareSetController.refs));

  router
    .route('/:drinkwareSetId')
    .get(permission('drinkware-sets|read'), wrapAsync(drinkwareSetController.read))
    .put(
      permission('drinkware-sets|edit'),
      upload.any(),
      bodyJsonField('scales'),
      validation.update,
      parseBaseImages,
      wrapAsync(drinkwareSetController.update),
    )
    .delete(permission('drinkware-sets|delete'), wrapAsync(drinkwareSetController.destroy));

  router.use('/:drinkwareSetId/scales', drinkScales());

  return router;
};
