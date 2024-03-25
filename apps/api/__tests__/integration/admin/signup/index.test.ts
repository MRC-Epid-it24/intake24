import signUp from './sign-up.test';
// import verify from './verify.test';

export default () => {
  describe('POST /api/admin/sign-up', signUp);
  // describe('POST /api/admin/sign-up/verify', verify);
};
