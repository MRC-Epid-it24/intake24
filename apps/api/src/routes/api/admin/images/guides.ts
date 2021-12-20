import { Router } from 'express';
import { anyPermission, permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/images/guides';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { guideImageController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('guide-images-create'), validation.store, wrapAsync(guideImageController.store))
  .get(
    permission('guide-images-browse'),
    validation.browse,
    wrapAsync(guideImageController.browse)
  );

router.get(
  '/refs',
  anyPermission(['guide-images-create', 'guide-images-read', 'guide-images-edit']),
  wrapAsync(guideImageController.refs)
);

router
  .route('/:guideImageId')
  .get(permission('guide-images-read'), wrapAsync(guideImageController.read))
  .put(permission('guide-images-edit'), validation.update, wrapAsync(guideImageController.update))
  .delete(permission('guide-images-delete'), wrapAsync(guideImageController.destroy));

router.get(
  '/:guideImageId/edit',
  permission('guide-images-edit'),
  wrapAsync(guideImageController.edit)
);

export default router;
