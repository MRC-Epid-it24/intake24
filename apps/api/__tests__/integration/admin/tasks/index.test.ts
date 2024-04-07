import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import run from './run.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/tasks', browse);
  describe('pOST /api/admin/tasks', store);
  describe('get /api/admin/tasks/:taskId', read);
  describe('get /api/admin/tasks/:taskId/edit', edit);
  describe('put /api/admin/tasks/:taskId', update);
  describe('delete /api/admin/tasks/:taskId', destroy);
  describe('pOST /api/admin/tasks/:taskId/run', run);
};
