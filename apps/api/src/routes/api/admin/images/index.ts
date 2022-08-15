import { Router } from 'express';

import asServedSets from './as-served-sets';
import drinkwareSets from './drinkware-sets';
import guideImages from './guide-images';
import imageMaps from './image-maps';

export default () => {
  const router = Router();

  router.use('/as-served-sets', asServedSets());
  router.use('/drinkware-sets', drinkwareSets());
  router.use('/guide-images', guideImages());
  router.use('/image-maps', imageMaps());

  return router;
};
