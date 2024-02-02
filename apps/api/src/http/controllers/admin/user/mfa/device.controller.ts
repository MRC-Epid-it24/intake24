import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { MFADeviceEntry, MFADevicesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { MFADevice, Op, User } from '@intake24/db';

const mfaDeviceController = () => {
  const toggle = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<undefined>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { status } = req.body;

    const devices = await MFADevice.findAll({ attributes: ['id'], where: { userId } });
    if (!devices.length) throw new ForbiddenError();

    await User.update({ multiFactorAuthentication: status }, { where: { id: userId } });

    res.json();
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<MFADevicesResponse>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    const user = await User.findByPk(userId, {
      include: [{ association: 'mfaDevices', where: { userId }, required: false }],
      order: [
        ['mfaDevices', 'preferred', 'DESC'],
        ['mfaDevices', 'id', 'ASC'],
      ],
    });
    if (!user) throw new NotFoundError();

    res.json({ status: user.multiFactorAuthentication, devices: user.mfaDevices ?? [] });
  };

  const read = async (
    req: Request<{ deviceId: string }>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { deviceId } = req.params;

    const device = await MFADevice.findOne({ where: { id: deviceId, userId } });
    if (!device) throw new NotFoundError();

    res.json(device);
  };

  const update = async (
    req: Request<{ deviceId: string }, any, { preferred: boolean }>,
    res: Response<MFADeviceEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { deviceId } = req.params;

    const device = await MFADevice.findOne({ where: { id: deviceId, userId } });
    if (!device) throw new NotFoundError();

    await device.update(pick(req.body, ['preferred']));

    if (req.body.preferred === true)
      await MFADevice.update(
        { preferred: false },
        { where: { id: { [Op.ne]: deviceId }, userId } }
      );

    res.json(device);
  };

  const destroy = async (
    req: Request<{ deviceId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { deviceId } = req.params;

    const device = await MFADevice.findOne({ attributes: ['id'], where: { id: deviceId, userId } });
    if (!device) throw new NotFoundError();

    await device.destroy();

    const devices = await MFADevice.findAll({ attributes: ['id'], where: { userId } });
    if (!devices.length)
      await User.update({ multiFactorAuthentication: false }, { where: { id: userId } });

    res.status(204).json();
  };

  return {
    toggle,
    browse,
    read,
    update,
    destroy,
  };
};

export default mfaDeviceController;

export type MFADeviceController = ReturnType<typeof mfaDeviceController>;
