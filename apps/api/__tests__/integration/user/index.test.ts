import getPhysicalData from './get-physical-data.test';
import password from './password.test';
import setPhysicalData from './set-physical-data.test';
import submissions from './submissions.test';

export default () => {
  describe('get /api/user/physical-data', getPhysicalData);
  describe('pOST /api/user/physical-data', setPhysicalData);
  describe('get /api/user/submissions', submissions);
  describe('get /api/user/password', password);
  // describe('GET /api/user/feedback', downloadFeedback);
  // describe('POST /api/user/feedback', emailFeedback);
};
