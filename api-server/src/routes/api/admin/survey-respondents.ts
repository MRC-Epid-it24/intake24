import { Router } from 'express';
import multer from 'multer';
import config from '@/config/filesystem';
import controller from '@/http/controllers/admin/survey-respondent.controller';
import { permission, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/respondents';
import { wrapAsync } from '@/util';

const router = Router({ mergeParams: true });
const upload = multer({ dest: config.local.uploads });

router.use(permission('surveys-respondents'), canManageSurvey());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router.post('/upload', upload.single('file'), validation.upload, wrapAsync(controller.upload));

router
  .route('/:userId')
  .put(validation.update, wrapAsync(controller.update))
  .delete(wrapAsync(controller.delete));

export default router;
