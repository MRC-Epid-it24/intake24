import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/mgmt';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { adminSurveyMgmtController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys-mgmt'));

router.get('', validation.browse, wrapAsync(adminSurveyMgmtController.browse));
router.get('/available', wrapAsync(adminSurveyMgmtController.available));
router.put('/:userId', validation.update, wrapAsync(adminSurveyMgmtController.update));

export default router;
