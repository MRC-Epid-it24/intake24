import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/user/password';

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url, { bearer: 'respondent' });
  });

  it('should return 400 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput(
      'post',
      url,
      ['password', 'passwordConfirm', 'passwordCurrent'],
      { bearer: 'respondent' },
    );
  });

  it('should return 400 for weak new passwords', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['password', 'passwordConfirm'], {
      bearer: 'respondent',
      input: {
        password: 'weakpassword',
        passwordConfirm: 'weakpassword',
        passwordCurrent: 'testRespondentPassword',
      },
    });
  });

  it('should return 400 for not matching new passwords', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['passwordConfirm'], {
      bearer: 'respondent',
      input: {
        password: 'newPassword123',
        passwordConfirm: 'notMatchingNewPassword123',
        passwordCurrent: 'testRespondentPassword',
      },
    });
  });

  it('should return 400 for invalid current password', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['passwordCurrent'], {
      bearer: 'respondent',
      input: {
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
        passwordCurrent: 'invalidPassword',
      },
    });
  });

  it('should return 200', async () => {
    await suite.sharedTests.assertAcknowledged('post', url, {
      bearer: 'respondent',
      input: {
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
        passwordCurrent: 'testRespondentPassword',
      },
    });
  });
};
