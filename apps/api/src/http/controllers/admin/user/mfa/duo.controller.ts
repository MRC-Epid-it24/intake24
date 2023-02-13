import type { Request, Response } from 'express';

import type {
  DuoRegistrationVerificationRequest,
  MFADeviceEntry,
} from '@intake24/common/types/http/admin';
import { randomString } from '@intake24/common/util';
import { MFADevice } from '@intake24/db/models';

const duoDeviceController = () => {
  const verify = async (
    req: Request<any, any, DuoRegistrationVerificationRequest>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle;
    const { name } = req.body;

    const device = await MFADevice.create({
      userId,
      provider: 'duo',
      name,
      secret: randomString(32),
    });

    res.json(device);
  };

  return { verify };
};

export default duoDeviceController;

export type DuoDeviceController = ReturnType<typeof duoDeviceController>;
