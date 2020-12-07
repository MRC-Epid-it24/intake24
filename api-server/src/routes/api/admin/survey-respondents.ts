import { Router } from 'express';
import multer from 'multer';
import { permission, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/respondents';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { config, adminSurveyRespondentController } = ioc.cradle;
const router = Router({ mergeParams: true });
const upload = multer({ dest: config.filesystem.local.uploads });

router.use(permission('surveys-respondents'), canManageSurvey());

router
  .route('')
  .post(validation.store, wrapAsync(adminSurveyRespondentController.store))
  .get(validation.list, wrapAsync(adminSurveyRespondentController.list));

router.post(
  '/upload',
  upload.single('file'),
  validation.upload,
  wrapAsync(adminSurveyRespondentController.upload)
);
router.post('/export-auth-urls', wrapAsync(adminSurveyRespondentController.exportAuthUrls));

router
  .route('/:userId')
  .put(validation.update, wrapAsync(adminSurveyRespondentController.update))
  .delete(wrapAsync(adminSurveyRespondentController.destroy));

export default router;
