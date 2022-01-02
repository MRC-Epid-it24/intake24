import fdbs from './fdbs/index.test';
import foodGroups from './food-groups/index.test';
import images from './images/index.test';
import jobs from './jobs/index.test';
import languages from './languages/index.test';
import locales from './locales/index.test';
import nutrientTables from './nutrient-tables/index.test';
import permissions from './permissions/index.test';
import roles from './roles/index.test';
import schemes from './schemes/index.test';
import schemeQuestions from './scheme-questions/index.test';
import signInLogs from './sign-in-logs/index.test';
import surveys from './surveys/index.test';
import tasks from './tasks/index.test';
import user from './user/index.test';
import users from './users/index.test';

export default (): void => {
  describe('/api/admin/fdbs', fdbs);
  describe('/api/admin/food-groups', foodGroups);
  describe('/api/admin/images', images);
  describe('/api/admin/jobs', jobs);
  describe('/api/admin/languages', languages);
  describe('/api/admin/locales', locales);
  describe('/api/admin/nutrient-tables', nutrientTables);
  describe('/api/admin/permissions', permissions);
  describe('/api/admin/roles', roles);
  describe('/api/admin/schemes', schemes);
  describe('/api/admin/scheme-questions', schemeQuestions);
  describe('/api/admin/sign-in-logs', signInLogs);
  describe('/api/admin/surveys', surveys);
  describe('/api/admin/tasks', tasks);
  describe('/api/admin/user', user);
  describe('/api/admin/users', users);
};
