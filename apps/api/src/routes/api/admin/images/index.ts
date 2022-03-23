import { Router } from 'express';
import asServed from './as-served';
import guides from './guides';
import maps from './maps';

export default () => {
  const router = Router();

  router.use('/as-served', asServed());
  router.use('/guides', guides());
  router.use('/maps', maps());

  return router;
};
