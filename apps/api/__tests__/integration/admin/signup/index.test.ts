import signUp from './sign-up.test';
// import verify from './verify.test';

export default () => {
  describe('POST /api/admin/signup', signUp);
  // describe('POST /api/admin/signup/verify', verify);
};
