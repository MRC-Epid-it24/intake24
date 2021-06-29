import { Router } from 'express';
import multer from 'multer';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/images/as-served-images';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

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
  .get(permission('as-served-detail'), wrapAsync(asServedImageController.detail))
  .delete(permission('as-served-delete'), wrapAsync(asServedImageController.destroy));

export default router;
