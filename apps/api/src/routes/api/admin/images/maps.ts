import { Router } from 'express';
import multer from 'multer';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/images/maps';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, imageMapController } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router
    .route('')
    .post(
      permission('image-maps|create'),
      upload.single('baseImage'),
      validation.store,
      wrapAsync(imageMapController.store)
    )
    .get(permission('image-maps|browse'), validation.browse, wrapAsync(imageMapController.browse));

  router.get(
    '/refs',
    anyPermission(['image-maps|create', 'image-maps|read', 'image-maps|edit']),
    wrapAsync(imageMapController.refs)
  );

  router
    .route('/:imageMapId')
    .get(permission('image-maps|read'), wrapAsync(imageMapController.read))
    .put(permission('image-maps|edit'), validation.update, wrapAsync(imageMapController.update))
    .delete(permission('image-maps|delete'), wrapAsync(imageMapController.destroy));

  router.get(
    '/:imageMapId/edit',
    permission('image-maps|edit'),
    wrapAsync(imageMapController.edit)
  );

  return router;
};
