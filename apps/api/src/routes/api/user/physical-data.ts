import { Router } from 'express';
import validation from '@api/http/requests/user';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { userPhysicalDataController } = ioc.cradle;

const router = Router();

router
  .route('')
  .get(wrapAsync(userPhysicalDataController.getPhysicalData))
  .post(validation.physicalData, wrapAsync(userPhysicalDataController.setPhysicalData));

export default router;
