import { Router } from 'express';

import drinkwareSets from './drinkware-sets';

export default () => {
  const router = Router();

  router.use('/drinkware-sets', drinkwareSets());

  return router;
};
