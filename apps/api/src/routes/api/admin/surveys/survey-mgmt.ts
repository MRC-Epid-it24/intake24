import { Router } from 'express';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/users/mgmt';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminSurveyMgmtController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys-mgmt'));

router.get('', validation.browse, wrapAsync(adminSurveyMgmtController.browse));
router.get('/available', wrapAsync(adminSurveyMgmtController.available));
router.put('/:userId', validation.update, wrapAsync(adminSurveyMgmtController.update));

export default router;
