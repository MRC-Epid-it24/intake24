import { Router } from 'express';
import passport from 'passport';
import languages from './languages';
import locales from './locales';
import permissions from './permissions';
import profile from './profile';
import roles from './roles';
import schemes from './schemes';
import surveys from './surveys';
import tasks from './tasks';
import users from './users';

const router = Router();

router.use(passport.authenticate('admin', { session: false }));

router.use('/profile', profile);
router.use('/languages', languages);
router.use('/locales', locales);
router.use('/permissions', permissions);
router.use('/roles', roles);
router.use('/schemes', schemes);
router.use('/surveys', surveys);
router.use('/tasks', tasks);
router.use('/users', users);

export default router;
