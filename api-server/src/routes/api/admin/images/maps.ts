import { Router } from 'express';
import multer from 'multer';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/images/maps';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { config, imageMapController } = ioc.cradle;
const router = Router();
const upload = multer({ dest: config.filesystem.local.uploads });

router
  .route('')
  .post(
    permission('image-maps-create'),
    upload.single('baseImage'),
    validation.store,
    wrapAsync(imageMapController.store)
  )
  .get(permission('image-maps-browse'), validation.browse, wrapAsync(imageMapController.browse));

router.get('/create', permission('image-maps-create'), wrapAsync(imageMapController.create));

router
  .route('/:imageMapId')
  .get(permission('image-maps-detail'), wrapAsync(imageMapController.detail))
  .put(permission('image-maps-edit'), validation.update, wrapAsync(imageMapController.update))
  .delete(permission('image-maps-delete'), wrapAsync(imageMapController.destroy));

router.get('/:imageMapId/edit', permission('image-maps-edit'), wrapAsync(imageMapController.edit));

export default router;
