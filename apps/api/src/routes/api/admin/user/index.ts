import { Router } from 'express';

import jobs from './jobs';
import mfa from './mfa';

export default () => {
  const router = Router();

  router.use('/jobs', jobs());
  router.use('/mfa', mfa());

  return router;
};
