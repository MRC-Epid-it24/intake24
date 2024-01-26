import jobs from './jobs/index.test';
import personalAccessTokens from './personal-access-tokens/index.test';
import profile from './profile.test';
import verify from './verify.test';

export default () => {
  describe('GET /api/admin/user', profile);
  describe('GET /api/admin/user/verify', verify);

  describe('GET /api/admin/user/jobs', jobs.browse);
  describe('GET /api/admin/user/jobs/:jobId', jobs.read);
  describe('GET /api/admin/user/jobs/:jobId/download', jobs.download);

  describe('GET /api/admin/user/personal-access-tokens', personalAccessTokens.browse);
  describe('POST /api/admin/user/personal-access-tokens', personalAccessTokens.issue);
  describe('DELETE /api/admin/user/personal-access-tokens/:tokenId', personalAccessTokens.revoke);
};
