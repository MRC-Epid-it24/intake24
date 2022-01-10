import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware/acl';

import fdbs from './fdbs';
import foodGroups from './food-groups';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import permissions from './permissions';
import roles from './roles';
import schemes from './schemes';
import schemeQuestions from './scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import tasks from './tasks';
import user from './user';
import users from './users';

const router = Router();

authenticate(router, 'admin');

router.use('/fdbs', fdbs);
router.use('/food-groups', foodGroups);
router.use('/images', images);
router.use('/jobs', jobs);
router.use('/languages', languages);
router.use('/locales', locales);
router.use('/nutrient-tables', nutrientTables);
router.use('/permissions', permissions);
router.use('/roles', roles);
router.use('/schemes', schemes);
router.use('/scheme-questions', schemeQuestions);
router.use('/sign-in-logs', signInLogs);
router.use('/surveys', surveys);
router.use('/tasks', tasks);
router.use('/user', user);
router.use('/users', users);

export default router;
