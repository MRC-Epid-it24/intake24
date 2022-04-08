import { Router } from 'express';
import validation from '@intake24/api/http/requests/user';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { userFeedbackController } = ioc.cradle;

  const router = Router();

  router.get('', validation.feedback, wrapAsync(userFeedbackController.download));

  return router;
};
