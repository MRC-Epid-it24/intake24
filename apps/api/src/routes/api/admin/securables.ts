import { Router } from 'express';

import type { SecurableController } from '@intake24/api/http/controllers';
import type { SecurableType } from '@intake24/common/security';
import validation from '@intake24/api/http/requests/admin/securables';
import { wrapAsync } from '@intake24/api/util';

export default (securable: SecurableType, controller: SecurableController) => {
  const router = Router({ mergeParams: true });

  router
    .route('')
    .get(validation.browse, wrapAsync(controller.browse))
    .post(validation.store(securable), wrapAsync(controller.store));

  router.get('/users', validation.browse, wrapAsync(controller.availableUsers));
  router.post('/owner', validation.owner, wrapAsync(controller.owner));

  router.use('/:userId', validation.entry('userId'));

  router
    .route('/:userId')
    .patch(validation.update(securable), wrapAsync(controller.update))
    .delete(wrapAsync(controller.destroy));

  return router;
};
