import { Router } from 'express';
import { permission, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { adminSurveyDataExportController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys-data-export'), canManageSurvey());

router.post('', validation.dataExport, wrapAsync(adminSurveyDataExportController.queue));
router.post('/sync', validation.dataExport, wrapAsync(adminSurveyDataExportController.sync));

export default router;
