import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/personal-access-tokens';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { personalAccessTokenController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .post(validation.store, wrapAsync(personalAccessTokenController.store))
    .get(validation.browse, wrapAsync(personalAccessTokenController.browse));

  router.use('/:tokenId', validation.entry('tokenId'));

  router.route('/:tokenId').delete(wrapAsync(personalAccessTokenController.revoke));

  return router;
};
