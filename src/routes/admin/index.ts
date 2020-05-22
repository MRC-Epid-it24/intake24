import { Router } from 'express';
import passport from 'passport';
import locales from './locales';
import surveys from './surveys';
import users from './users';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

router.use('/locales', locales);
router.use('/surveys', surveys);
router.use('/users', users);

export default router;
