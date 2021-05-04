import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/scheme-questions';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { schemeQuestionController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(
    permission('scheme-questions-create'),
    validation.store,
    wrapAsync(schemeQuestionController.store)
  )
  .get(
    permission('scheme-questions-browse'),
    validation.browse,
    wrapAsync(schemeQuestionController.browse)
  );

router.get(
  '/create',
  permission('scheme-questions-create'),
  wrapAsync(schemeQuestionController.create)
);

router
  .route('/:schemeQuestionId')
  .get(
    permission('scheme-questions-detail'),
    validation.entry('schemeQuestionId'),
    wrapAsync(schemeQuestionController.detail)
  )
  .put(
    permission('scheme-questions-edit'),
    validation.entry('schemeQuestionId'),
    validation.update,
    wrapAsync(schemeQuestionController.update)
  )
  .delete(
    permission('scheme-questions-delete'),
    validation.entry('schemeQuestionId'),
    wrapAsync(schemeQuestionController.destroy)
  );

router.get(
  '/:schemeQuestionId/edit',
  permission('scheme-questions-edit'),
  validation.entry('schemeQuestionId'),
  wrapAsync(schemeQuestionController.edit)
);

router.post(
  '/:schemeQuestionId/sync',
  permission('scheme-questions-sync'),
  validation.entry('schemeQuestionId'),
  wrapAsync(schemeQuestionController.sync)
);

export default router;
