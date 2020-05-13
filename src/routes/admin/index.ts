import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

export default router;
