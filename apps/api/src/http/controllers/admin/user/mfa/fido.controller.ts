import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  FIDORegistrationChallenge,
  FIDORegistrationVerificationRequest,
  MFADeviceEntry,
} from '@intake24/common/types/http/admin';
import { ApplicationError } from '@intake24/api/http/errors';

const fidoDeviceController = ({ fidoProvider }: Pick<IoC, 'fidoProvider'>) => {
  const challenge = async (
    req: Request,
    res: Response<FIDORegistrationChallenge>
  ): Promise<void> => {
    const {
      currentUser: { email, name },
      userId,
    } = req.scope.cradle;

    const options = await fidoProvider.registrationChallenge(
      userId,
      email ?? undefined,
      name ?? undefined
    );

    req.session.fidoRegChallenge = { challengeId: options.challenge };

    res.json(options);
  };

  const verify = async (
    req: Request<any, any, FIDORegistrationVerificationRequest>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle;
    const { challengeId, name, response } = req.body;

    if (req.session.fidoRegChallenge?.challengeId !== challengeId) {
      delete req.session.fidoRegChallenge;
      throw new ApplicationError('Invalid session challenge, repeat device registration.');
    }

    const device = await fidoProvider.registrationVerification({
      userId,
      name,
      expectedChallenge: challengeId,
      response,
    });

    delete req.session.fidoRegChallenge;

    res.json(device);
  };

  return { challenge, verify };
};

export default fidoDeviceController;

export type FIDODeviceController = ReturnType<typeof fidoDeviceController>;
