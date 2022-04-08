import { Router } from 'express';
import { wrapAsync } from '@intake24/api/util';
import validation from '@intake24/api/http/requests/admin/securables';
import type { SecurableController } from '@intake24/api/http/controllers';

export default (securableController: SecurableController) => {
  const router = Router({ mergeParams: true });

  router
    .route('')
    .get(validation.browse, wrapAsync(securableController.browse))
    .post(validation.store, wrapAsync(securableController.store));

  router.get('/users', validation.browse, wrapAsync(securableController.availableUsers));

  router.use('/:userId', validation.entry('userId'));

  router
    .route('/:userId')
    .patch(validation.update, wrapAsync(securableController.update))
    .delete(wrapAsync(securableController.destroy));

  return router;
};
