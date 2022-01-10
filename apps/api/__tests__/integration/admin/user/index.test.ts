import profile from './profile/index.test';
import jobs from './jobs/index.test';

export default () => {
  describe('GET /api/admin/user', profile);

  describe('GET /api/admin/user/jobs', jobs.browse);
  describe('GET /api/admin/user/jobs/:jobId', jobs.read);
  describe('GET /api/admin/user/jobs/:jobId/download', jobs.download);
};
