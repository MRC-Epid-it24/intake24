import { Router } from 'express';
import validation from '@api/http/requests/user';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { userSubmissionsController } = ioc.cradle;

const router = Router();

router.get('', validation.submissions, wrapAsync(userSubmissionsController.submissions));

export default router;
