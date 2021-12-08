import { Router } from 'express';
import multer from 'multer';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/users/respondents';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { fsConfig, adminSurveyRespondentController } = ioc.cradle;
const router = Router({ mergeParams: true });
const upload = multer({ dest: fsConfig.local.uploads });

router.use(permission('surveys-respondents'));

router
  .route('')
  .post(validation.store, wrapAsync(adminSurveyRespondentController.store))
  .get(validation.browse, wrapAsync(adminSurveyRespondentController.browse));

router.post(
  '/upload',
  upload.single('file'),
  validation.upload,
  wrapAsync(adminSurveyRespondentController.upload)
);
router.post('/export-auth-urls', wrapAsync(adminSurveyRespondentController.exportAuthUrls));

router
  .route('/:userId')
  .get(wrapAsync(adminSurveyRespondentController.read))
  .patch(validation.update, wrapAsync(adminSurveyRespondentController.update))
  .delete(wrapAsync(adminSurveyRespondentController.destroy));

router.get('/:userId/edit', wrapAsync(adminSurveyRespondentController.edit));

export default router;
