import { Router } from 'express';
import validation from '@intake24/api/http/requests/user';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { userPhysicalDataController } = ioc.cradle;

const router = Router();

router
  .route('')
  .get(wrapAsync(userPhysicalDataController.getPhysicalData))
  .post(validation.physicalData, wrapAsync(userPhysicalDataController.setPhysicalData));

export default router;
