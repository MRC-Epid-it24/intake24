import { Router } from 'express';
import { anyPermission, permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/scheme-questions';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

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
  '/refs',
  anyPermission(['scheme-questions-create', 'scheme-questions-read', 'scheme-questions-edit']),
  wrapAsync(schemeQuestionController.refs)
);

router
  .route('/:schemeQuestionId')
  .get(permission('scheme-questions-read'), wrapAsync(schemeQuestionController.read))
  .put(
    permission('scheme-questions-edit'),
    validation.update,
    wrapAsync(schemeQuestionController.update)
  )
  .delete(permission('scheme-questions-delete'), wrapAsync(schemeQuestionController.destroy));

router.get(
  '/:schemeQuestionId/edit',
  permission('scheme-questions-edit'),
  wrapAsync(schemeQuestionController.edit)
);

router.post(
  '/:schemeQuestionId/sync',
  permission('scheme-questions-sync'),
  validation.sync,
  wrapAsync(schemeQuestionController.sync)
);

export default router;
