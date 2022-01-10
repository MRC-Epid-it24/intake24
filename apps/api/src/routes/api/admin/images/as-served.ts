import { Router } from 'express';
import multer from 'multer';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/images/as-served';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
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

router.get(
  '/refs',
  anyPermission(['as-served-create', 'as-served-read', 'as-served-edit']),
  wrapAsync(asServedSetController.refs)
);

router
  .route('/:asServedSetId')
  .get(permission('as-served-read'), wrapAsync(asServedSetController.read))
  .put(permission('as-served-edit'), validation.update, wrapAsync(asServedSetController.update))
  .delete(permission('as-served-delete'), wrapAsync(asServedSetController.destroy));

router.get(
  '/:asServedSetId/edit',
  permission('as-served-edit'),
  wrapAsync(asServedSetController.edit)
);

router.use('/:asServedSetId/images', asServedImages);

export default router;
