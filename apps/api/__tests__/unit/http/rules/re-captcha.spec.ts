import { reCaptcha } from '@intake24/api/http/rules';

describe('Google re-captcha middleware', () => {
  it('should pass when re-captcha disabled', async () => {
    const config = {
      enabled: false,
      secret: 'aSuperSecret',
    };

    const result = await reCaptcha('ReCaptchaChallengeToken', config);
    expect(result).toBeUndefined();
  });

  it('should fail when token is not string', async () => {
    const config = {
      enabled: true,
      secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    };

    expect.assertions(1);

    try {
      await reCaptcha(['not a string'], config);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should fail when token is missing', async () => {
    const config = {
      enabled: true,
      secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    };

    expect.assertions(1);

    try {
      await reCaptcha('', config);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should fail when secret is invalid', async () => {
    const config = {
      enabled: true,
      secret: 'invalidSecret',
    };

    expect.assertions(1);

    try {
      await reCaptcha('ReCaptchaChallengeToken', config);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should pass token challenge', async () => {
    const config = {
      enabled: true,
      secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    };

    const result = await reCaptcha('ReCaptchaChallengeToken', config);
    expect(result).toBeUndefined();
  });
});
