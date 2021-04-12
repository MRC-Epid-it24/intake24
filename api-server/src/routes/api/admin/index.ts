import { Router } from 'express';
import { authenticate } from '@/http/middleware/acl';

import user from './user';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import permissions from './permissions';
import roles from './roles';
import schemes from './schemes';
import surveys from './surveys';
import tasks from './tasks';
import users from './users';

const router = Router();

authenticate(router, 'admin');

router.use('/user', user);
router.use('/images', images);
router.use('/jobs', jobs);
router.use('/languages', languages);
router.use('/locales', locales);
router.use('/permissions', permissions);
router.use('/roles', roles);
router.use('/schemes', schemes);
router.use('/surveys', surveys);
router.use('/tasks', tasks);
router.use('/users', users);

export default router;
