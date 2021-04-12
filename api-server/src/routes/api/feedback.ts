import { Router } from 'express';
import { authenticate, isSurveyRespondent } from '@/http/middleware/acl';

const router = Router();

authenticate(router, 'user');
router.use(isSurveyRespondent());

export default router;
