import { Router } from 'express';

import global from './global';
import local from './local';

export default () => {
  const router = Router();

  router.use('/local', local());
  router.use('/global', global());

  return router;
};
