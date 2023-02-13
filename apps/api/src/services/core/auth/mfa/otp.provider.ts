import { TOTP } from 'otpauth';
import QRCode from 'qrcode';

import type { IoC } from '@intake24/api/ioc';
import type { OTPAuthChallenge } from '@intake24/common/security';
import { ValidationError } from '@intake24/api/http/errors';
import { randomString } from '@intake24/common/util';
import { MFADevice } from '@intake24/db';

export type OTPRegistrationVerificationOps = {
  userId: string;
  name: string;
  token: string;
  secret: string;
};

export type OTPAuthenticationVerificationOps = {
  token: string;
  secret: string;
};

const optProvider = ({ securityConfig }: Pick<IoC, 'securityConfig'>) => {
  const provider = 'otp';
  const { issuer } = securityConfig.mfa.providers[provider];
  const algorithm = 'SHA1';

  const registrationChallenge = async () => {
    const secret = randomString(20, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');

    const totp = new TOTP({ issuer, label: issuer, algorithm, secret });
    const url = totp.toString();
    const qrCode = await QRCode.toDataURL(url);

    return { secret, url, qrCode };
  };

  const registrationVerification = async (ops: OTPRegistrationVerificationOps) => {
    const { userId, name, token, secret } = ops;

    const totp = new TOTP({ issuer, label: issuer, algorithm, secret });

    const result = totp.validate({ token });
    if (result === null)
      throw new ValidationError('Invalid OTP challenge, try again.', { param: 'token' });

    return MFADevice.create({ userId, provider: 'otp', name, secret });
  };

  /**
   * Create OTP authentication request
   *
   * @param {MFADevice} device
   * @returns {Promise<OTPAuthChallenge>}
   */
  const authenticationChallenge = async (device: MFADevice): Promise<OTPAuthChallenge> => ({
    challengeId: randomString(32),
    deviceId: device.id,
    provider,
  });

  /**
   * Verify OTP authentication response
   *
   * @param {OTPAuthenticationVerificationOps} ops
   * @returns {Promise<boolean>}
   */
  const authenticationVerification = async (
    ops: OTPAuthenticationVerificationOps
  ): Promise<boolean> => {
    const { secret, token } = ops;

    const totp = new TOTP({ issuer, label: issuer, algorithm, secret });

    const delta = totp.validate({ token });
    return delta !== null;
  };

  return {
    registrationChallenge,
    registrationVerification,
    authenticationChallenge,
    authenticationVerification,
  };
};

export default optProvider;

export type OTPProvider = ReturnType<typeof optProvider>;
