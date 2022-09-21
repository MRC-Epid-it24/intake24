import { Router } from 'express';

import jobs from './jobs';

export default () => {
  const router = Router();

  router.use('/jobs', jobs());

  return router;
};
