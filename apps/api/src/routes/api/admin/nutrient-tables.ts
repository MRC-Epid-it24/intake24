import { Router } from 'express';
import multer from 'multer';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/nutrient-tables';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { fsConfig, nutrientTableController } = ioc.cradle;
const router = Router();
const upload = multer({ dest: fsConfig.local.uploads });

router
  .route('')
  .post(
    permission('nutrient-tables-create'),
    validation.store,
    wrapAsync(nutrientTableController.store)
  )
  .get(
    permission('nutrient-tables-browse'),
    validation.browse,
    wrapAsync(nutrientTableController.browse)
  );

router.get(
  '/refs',
  anyPermission(['nutrient-tables-create', 'nutrient-tables-read', 'nutrient-tables-edit']),
  wrapAsync(nutrientTableController.refs)
);

router
  .route('/:nutrientTableId')
  .get(permission('nutrient-tables-read'), wrapAsync(nutrientTableController.read))
  .put(
    permission('nutrient-tables-edit'),
    validation.update,
    wrapAsync(nutrientTableController.update)
  )
  .delete(permission('nutrient-tables-delete'), wrapAsync(nutrientTableController.destroy));

router.get(
  '/:nutrientTableId/edit',
  permission('nutrient-tables-edit'),
  wrapAsync(nutrientTableController.edit)
);

router.post(
  '/:nutrientTableId/upload',
  upload.single('file'),
  permission('nutrient-tables-upload'),
  validation.upload,
  wrapAsync(nutrientTableController.upload)
);

export default router;
