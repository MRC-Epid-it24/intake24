import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  MFADeviceEntry,
  OTPRegistrationChallenge,
  OTPRegistrationVerificationRequest,
} from '@intake24/common/types/http/admin';
import { ApplicationError } from '@intake24/api/http/errors';
import { randomString } from '@intake24/common/util';

const otpDeviceController = ({ otpProvider }: Pick<IoC, 'otpProvider'>) => {
  const challenge = async (
    req: Request,
    res: Response<OTPRegistrationChallenge>
  ): Promise<void> => {
    const {
      currentUser: { email },
    } = req.scope.cradle;

    if (!email) throw new ApplicationError('Invalid user - missing email.');

    const challengeId = randomString(32);
    const { secret, ...rest } = await otpProvider.registrationChallenge(email);

    req.session.otpRegChallenge = { challengeId, secret };

    res.json({ challengeId, ...rest });
  };

  const verify = async (
    req: Request<any, any, OTPRegistrationVerificationRequest>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const {
      userId,
      currentUser: { email },
    } = req.scope.cradle;

    if (!email) throw new ApplicationError('Invalid user - missing email.');
    const { challengeId, name, token } = req.body;

    if (req.session.otpRegChallenge?.challengeId !== challengeId) {
      delete req.session.otpRegChallenge;
      throw new ApplicationError('Invalid session challenge, repeat device registration.');
    }

    const { secret } = req.session.otpRegChallenge;
    const device = await otpProvider.registrationVerification({
      userId,
      email,
      name,
      token,
      secret,
    });

    delete req.session.otpRegChallenge;

    res.json(device);
  };

  return { challenge, verify };
};

export default otpDeviceController;

export type OTPDeviceController = ReturnType<typeof otpDeviceController>;
