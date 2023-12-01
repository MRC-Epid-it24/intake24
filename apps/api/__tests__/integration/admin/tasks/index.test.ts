import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import run from './run.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/tasks', browse);
  describe('POST /api/admin/tasks', store);
  describe('GET /api/admin/tasks/:taskId', read);
  describe('GET /api/admin/tasks/:taskId/edit', edit);
  describe('PUT /api/admin/tasks/:taskId', update);
  describe('DELETE /api/admin/tasks/:taskId', destroy);
  describe('POST /api/admin/tasks/:taskId/run', run);
};
