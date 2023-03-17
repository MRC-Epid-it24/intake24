import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/mfa';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { mfaDeviceController, duoDeviceController, fidoDeviceController, otpDeviceController } =
    ioc.cradle;
  const router = Router();

  router.get('', wrapAsync(mfaDeviceController.browse));

  router.post('/toggle', validation.toggle, wrapAsync(mfaDeviceController.toggle));

  router
    .route('/duo')
    .get(wrapAsync(duoDeviceController.challenge))
    .post(validation.duo.verify, wrapAsync(duoDeviceController.verify));

  router
    .route('/otp')
    .get(wrapAsync(otpDeviceController.challenge))
    .post(validation.otp.verify, wrapAsync(otpDeviceController.verify));

  router
    .route('/fido')
    .get(wrapAsync(fidoDeviceController.challenge))
    .post(validation.fido.verify, wrapAsync(fidoDeviceController.verify));

  router.use('/:deviceId', validation.entry('deviceId'));

  router
    .route('/:deviceId')
    .get(wrapAsync(mfaDeviceController.read))
    .patch(validation.update, wrapAsync(mfaDeviceController.update))
    .delete(wrapAsync(mfaDeviceController.destroy));

  return router;
};
