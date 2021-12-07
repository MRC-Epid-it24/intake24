import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import run from './run.test';

export default () => {
  describe('GET /api/admin/tasks', browse);
  describe('GET /api/admin/tasks/create', create);
  describe('POST /api/admin/tasks', store);
  describe('GET /api/admin/tasks/:taskId', read);
  describe('GET /api/admin/tasks/:taskId/edit', edit);
  describe('PUT /api/admin/tasks/:taskId', update);
  describe('DELETE /api/admin/tasks/:taskId', destroy);
  describe('POST /api/admin/tasks/:taskId/run', run);
};
