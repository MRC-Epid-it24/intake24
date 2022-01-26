import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/users/mgmt';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { adminSurveyMgmtController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys|mgmt'));

router
  .route('')
  .get(validation.browse, wrapAsync(adminSurveyMgmtController.browse))
  .post(validation.store, wrapAsync(adminSurveyMgmtController.store));

router.get('/permissions', wrapAsync(adminSurveyMgmtController.availablePermissions));
router.get('/users', validation.browse, wrapAsync(adminSurveyMgmtController.availableUsers));
router.patch('/:userId', validation.update, wrapAsync(adminSurveyMgmtController.update));

export default router;
