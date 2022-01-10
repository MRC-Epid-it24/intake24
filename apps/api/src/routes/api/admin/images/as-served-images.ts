import { Router } from 'express';
import multer from 'multer';
import { permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/images/as-served-images';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { fsConfig, asServedImageController } = ioc.cradle;
const router = Router({ mergeParams: true });
const upload = multer({ dest: fsConfig.local.uploads });

router
  .route('')
  .post(
    permission('as-served-create'),
    upload.single('image'),
    validation.store,
    wrapAsync(asServedImageController.store)
  )
  .get(
    permission('as-served-browse'),
    validation.browse,
    wrapAsync(asServedImageController.browse)
  );

router
  .route('/:asServedImageId')
  .get(permission('as-served-read'), wrapAsync(asServedImageController.read))
  .delete(permission('as-served-delete'), wrapAsync(asServedImageController.destroy));

export default router;
