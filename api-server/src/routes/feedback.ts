import { Router } from 'express';
import passport from 'passport';
import { isSurveyRespondent } from '@/http/middleware/acl';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
router.use(isSurveyRespondent());

export default router;
