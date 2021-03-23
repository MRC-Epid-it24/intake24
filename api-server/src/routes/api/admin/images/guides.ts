import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/images/guides';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

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

router.get('/create', permission('guide-images-create'), wrapAsync(guideImageController.create));

router
  .route('/:guideId')
  .get(permission('guide-images-detail'), wrapAsync(guideImageController.detail))
  .put(permission('guide-images-edit'), validation.update, wrapAsync(guideImageController.update))
  .delete(permission('guide-images-delete'), wrapAsync(guideImageController.destroy));

router.get('/:guideId/edit', permission('guide-images-edit'), wrapAsync(guideImageController.edit));

export default router;
