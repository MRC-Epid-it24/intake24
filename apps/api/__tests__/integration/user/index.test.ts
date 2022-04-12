import getPhysicalData from './get-physical-data.test';
import setPhysicalData from './set-physical-data.test';
import password from './password.test';
import submissions from './submissions.test';

export default () => {
  describe('GET /api/user/physical-data', getPhysicalData);
  describe('POST /api/user/physical-data', setPhysicalData);
  describe('GET /api/user/submissions', submissions);
  describe('GET /api/user/password', password);
  // describe('GET /api/user/feedback', downloadFeedback);
  // describe('POST /api/user/feedback', emailFeedback);
};
