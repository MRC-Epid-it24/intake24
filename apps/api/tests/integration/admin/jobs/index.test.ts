import browse from './browse.test';
import read from './read.test';
import download from './download.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/jobs', browse);
  describe('GET /api/admin/jobs/:jobId', read);
  describe('GET /api/admin/jobs/:jobId/download', download);
  describe('DELETE /api/admin/jobs/:jobId', destroy);
};
