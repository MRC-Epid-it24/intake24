import { pick } from 'lodash';
import { Request, Response } from 'express';
import { User } from '@intake24/db';
import type { IoC } from '@api/ioc';
import { UserPhysicalDataResponse } from '@common/types/http';
import { Controller } from '../controller';

export type UserPhysicalDataController = Controller<'getPhysicalData' | 'setPhysicalData'>;

export default ({ userService }: Pick<IoC, 'userService'>): UserPhysicalDataController => {
  const getPhysicalData = async (
    req: Request,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { id } = req.user as User;

    const data = await userService.getPhysicalData(id);

    res.json(data);
  };

  const setPhysicalData = async (
    req: Request,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;

    const data = await userService.setPhysicalData(
      userId,
      pick(req.body, [
        'sex',
        'birthdate',
        'weightKg',
        'heightCm',
        'physicalActivityLevelId',
        'weightTarget',
      ])
    );

    res.json(data);
  };

  return {
    getPhysicalData,
    setPhysicalData,
  };
};
