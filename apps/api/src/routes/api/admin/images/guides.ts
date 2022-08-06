import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/images/guides';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { guideImageController } = ioc.cradle;
  const router = Router();

  router.use(permission('guide-images'));

  router
    .route('')
    .post(
      permission('guide-images|create'),
      validation.store,
      wrapAsync(guideImageController.store)
    )
    .get(
      permission('guide-images|browse'),
      validation.browse,
      wrapAsync(guideImageController.browse)
    );

  router.get('/refs', wrapAsync(guideImageController.refs));

  router
    .route('/:guideImageId')
    .get(permission('guide-images|read'), wrapAsync(guideImageController.read))
    .put(permission('guide-images|edit'), validation.update, wrapAsync(guideImageController.update))
    .delete(permission('guide-images|delete'), wrapAsync(guideImageController.destroy));

  router.get(
    '/:guideImageId/edit',
    permission('guide-images|edit'),
    wrapAsync(guideImageController.edit)
  );

  return router;
};
