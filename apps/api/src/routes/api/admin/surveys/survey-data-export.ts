import { Router } from 'express';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/surveys';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminSurveyDataExportController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys-data-export'));

router.post('', validation.dataExport, wrapAsync(adminSurveyDataExportController.queue));
router.post('/sync', validation.dataExport, wrapAsync(adminSurveyDataExportController.sync));

export default router;
