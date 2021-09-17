import { Router } from 'express';
import multer from 'multer';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/nutrient-tables';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

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
  '/create',
  permission('nutrient-tables-create'),
  wrapAsync(nutrientTableController.create)
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
  validation.upload,
  wrapAsync(nutrientTableController.upload)
);

export default router;
