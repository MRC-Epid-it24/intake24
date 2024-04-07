import { PasswordBcrypt } from '@intake24/common-backend';

describe('passwordBcrypt', () => {
  it('should pass on correct password', async () => {
    const password = new PasswordBcrypt();
    const hashedPassword = await password.hash('password');
    const result = await password.verify('password', hashedPassword);

    expect(result).toBeTrue();
  });

  it('should fail on incorrect password', async () => {
    const password = new PasswordBcrypt();
    const hashedPassword = await password.hash('password');
    const result = await password.verify('wrong-password', hashedPassword);

    expect(result).toBeFalse();
  });
});
