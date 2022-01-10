import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/foods';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { portionSizeController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

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

router.get('/guide-images', validation.portionSizeId, wrapAsync(portionSizeController.guideImages));
router.get('/guide-images/:id', wrapAsync(portionSizeController.guideImage));

router.get('/image-maps', validation.portionSizeId, wrapAsync(portionSizeController.imageMaps));
router.get('/image-maps/:id', wrapAsync(portionSizeController.imageMap));

router.get('/weight', wrapAsync(portionSizeController.weight));

export default router;
