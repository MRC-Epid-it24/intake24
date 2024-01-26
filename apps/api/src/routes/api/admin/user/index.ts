import { Router } from 'express';

import jobs from './jobs';
import mfa from './mfa';
import personalAccessTokens from './personal-access-tokens';

export default () => {
  const router = Router();

  router.use('/jobs', jobs());
  router.use('/mfa', mfa());
  router.use('/personal-access-tokens', personalAccessTokens());

  return router;
};
