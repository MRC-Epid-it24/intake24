import { pick } from 'lodash';
import { Request, Response } from 'express';
import { User, UserPhysicalData } from '@api/db/models/system';
import { UserPhysicalDataResponse } from '@common/types/http';
import type { IoC } from '@api/ioc';
import { Controller } from './controller';

export type UserController = Controller<'submissions' | 'getPhysicalData' | 'setPhysicalData'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): UserController => {
  const submissions = async (
    req: Request<any, any, any, { surveyId: string | string[] }>,
    res: Response
  ): Promise<void> => {
    const { surveyId } = req.query;
    const { id: userId } = req.user as User;

    const data = await surveyService.getSubmissions(surveyId, userId);

    res.json(data);
  };

  const getPhysicalData = async (
    req: Request,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { id } = req.user as User;

    const data = await UserPhysicalData.findByPk(id);

    res.json(data);
  };

  const setPhysicalData = async (
    req: Request,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;

    const [data] = await UserPhysicalData.upsert({
      userId,
      ...pick(req.body, [
        'sex',
        'birthdate',
        'weightKg',
        'heightCm',
        'physicalActivityLevelId',
        'weightTarget',
      ]),
    });

    res.json(data);
  };

  return {
    submissions,
    getPhysicalData,
    setPhysicalData,
  };
};
