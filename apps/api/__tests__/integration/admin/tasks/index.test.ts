import browse from './browse.test';
import destroy from './destroy.test';
import read from './read.test';
import run from './run.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/tasks', browse);
  describe('post /api/admin/tasks', store);
  describe('get /api/admin/tasks/:taskId', read);
  describe('put /api/admin/tasks/:taskId', update);
  describe('delete /api/admin/tasks/:taskId', destroy);
  describe('post /api/admin/tasks/:taskId/run', run);
};
