import { Router } from 'express';
import multer from 'multer';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/images/as-served';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';
import asServedImages from './as-served-images';

const { fsConfig, asServedSetController } = ioc.cradle;
const router = Router();
const upload = multer({ dest: fsConfig.local.uploads });

router
  .route('')
  .post(
    permission('as-served-create'),
    upload.single('selectionImage'),
    validation.store,
    wrapAsync(asServedSetController.store)
  )
  .get(permission('as-served-browse'), validation.browse, wrapAsync(asServedSetController.browse));

router.get('/create', permission('as-served-create'), wrapAsync(asServedSetController.create));

router
  .route('/:asServedSetId')
  .get(permission('as-served-detail'), wrapAsync(asServedSetController.detail))
  .put(permission('as-served-edit'), validation.update, wrapAsync(asServedSetController.update))
  .delete(permission('as-served-delete'), wrapAsync(asServedSetController.destroy));

router.get(
  '/:asServedSetId/edit',
  permission('as-served-edit'),
  wrapAsync(asServedSetController.edit)
);

router.use('/:asServedSetId/images', asServedImages);

export default router;
