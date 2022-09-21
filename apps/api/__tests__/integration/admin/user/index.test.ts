import jobs from './jobs/index.test';
import profile from './profile.test';
import verify from './verify.test';

export default () => {
  describe('GET /api/admin/user', profile);
  describe('GET /api/admin/user/verify', verify);

  describe('GET /api/admin/user/jobs', jobs.browse);
  describe('GET /api/admin/user/jobs/:jobId', jobs.read);
  describe('GET /api/admin/user/jobs/:jobId/download', jobs.download);
};
