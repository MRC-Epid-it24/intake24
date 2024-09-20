import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';

import drinkScales from './drink-scales';

export default () => {
  const router = Router();

  router.use(permission('drinkware-sets'));

  router.use('/:drinkwareSetId/scales', drinkScales());

  return router;
};
