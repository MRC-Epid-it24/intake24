import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Subject } from '@intake24/common/security';
import type {
  DuoRegistrationChallenge,
  DuoRegistrationVerificationRequest,
  MFADeviceEntry,
} from '@intake24/common/types/http/admin';
import { ApplicationError } from '@intake24/api/http/errors';
import { atob } from '@intake24/api/util';

const duoDeviceController = ({ duoProvider }: Pick<IoC, 'duoProvider'>) => {
  const challenge = async (
    req: Request,
    res: Response<DuoRegistrationChallenge>
  ): Promise<void> => {
    const subject = atob<Subject>(req.scope.cradle.user.sub);
    if (subject.provider !== 'email') throw new ApplicationError('Invalid user - missing email.');

    const options = await duoProvider.registrationChallenge(subject.providerKey);

    req.session.duoRegChallenge = { challengeId: options.challengeId };

    res.json(options);
  };

  const verify = async (
    req: Request<any, any, DuoRegistrationVerificationRequest>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const { sub, userId } = req.scope.cradle.user;
    const { challengeId, name, token } = req.body;
    const subject = atob<Subject>(sub);

    if (subject.provider !== 'email') throw new ApplicationError('Invalid user - missing email.');

    if (req.session.duoRegChallenge?.challengeId !== challengeId) {
      delete req.session.duoRegChallenge;
      throw new ApplicationError('Invalid session challenge, repeat device registration.');
    }

    const device = await duoProvider.registrationVerification({
      userId,
      name,
      email: subject.providerKey,
      token,
    });

    delete req.session.duoRegChallenge;

    res.json(device);
  };

  return { challenge, verify };
};

export default duoDeviceController;

export type DuoDeviceController = ReturnType<typeof duoDeviceController>;
