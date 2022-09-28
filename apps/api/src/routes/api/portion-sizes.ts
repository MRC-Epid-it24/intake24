import { Router } from 'express';

import { authenticate } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/foods';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { portionSizeController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  router.get(
    '/as-served-sets',
    validation.portionSizeId,
    wrapAsync(portionSizeController.asServedSets)
  );
  router.get('/as-served-sets/:id', wrapAsync(portionSizeController.asServedSet));

  router.get(
    '/drinkware-sets',
    validation.portionSizeId,
    wrapAsync(portionSizeController.drinkwareSets)
  );
  router.get('/drinkware-sets/:id', wrapAsync(portionSizeController.drinkwareSet));

  router.get(
    '/guide-images',
    validation.portionSizeId,
    wrapAsync(portionSizeController.guideImages)
  );
  router.get('/guide-images/:id', wrapAsync(portionSizeController.guideImage));

  router.get('/image-maps', validation.portionSizeId, wrapAsync(portionSizeController.imageMaps));
  router.get('/image-maps/:id', wrapAsync(portionSizeController.imageMap));

  router.get(
    '/standard-units',
    validation.portionSizeId,
    wrapAsync(portionSizeController.standardUnits)
  );
  router.get('/standard-units/:id', wrapAsync(portionSizeController.standardUnit));

  router.get('/weight', wrapAsync(portionSizeController.weight));

  return router;
};
