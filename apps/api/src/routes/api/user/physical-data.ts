import { Router } from 'express';
import validation from '@intake24/api/http/requests/user';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { userPhysicalDataController } = ioc.cradle;

  const router = Router();

  router
    .route('')
    .get(validation.getPhysicalData, wrapAsync(userPhysicalDataController.getPhysicalData))
    .post(validation.setPhysicalData, wrapAsync(userPhysicalDataController.setPhysicalData));

  return router;
};
