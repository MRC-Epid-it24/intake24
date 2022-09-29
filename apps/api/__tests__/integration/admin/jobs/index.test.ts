import browse from './browse.test';
import destroy from './destroy.test';
import download from './download.test';
import read from './read.test';

export default () => {
  describe('GET /api/admin/jobs', browse);
  describe('GET /api/admin/jobs/:jobId', read);
  describe('GET /api/admin/jobs/:jobId/download', download);
  // describe('GET /api/admin/jobs/:jobId/repeat', repeat);
  describe('DELETE /api/admin/jobs/:jobId', destroy);
};
