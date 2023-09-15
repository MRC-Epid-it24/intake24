import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { localeRecipeFoodsController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  // getting existing recipe foods or adding/modifying/deleting new or existing recipe foods
  router
    .route('')
    .post(validation.recipeFoods, wrapAsync(localeRecipeFoodsController.set))
    .get(wrapAsync(localeRecipeFoodsController.get));

  // getting existing recipe food steps for the specific recipe food or adding/modifying/deleting new or existing recipe food steps
  router
    .route('/:recipeFoodId/steps')
    .post(validation.recipeFoodsSteps, wrapAsync(localeRecipeFoodsController.setSteps))
    .get(wrapAsync(localeRecipeFoodsController.getSteps));

  return router;
};
