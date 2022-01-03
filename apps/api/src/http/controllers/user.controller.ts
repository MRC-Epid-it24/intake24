import { pick } from 'lodash';
import { Request, Response } from 'express';
import { User, UserPassword } from '@api/db';
import type { IoC } from '@api/ioc';
import { UserPhysicalDataResponse } from '@common/types/http';
import { Controller } from './controller';
import { ValidationError } from '../errors';

export type UserController = Controller<
  'submissions' | 'getPhysicalData' | 'setPhysicalData' | 'updatePassword'
>;

export default ({
  adminUserService,
  authenticationService,
  surveyService,
  userService,
}: Pick<
  IoC,
  'adminUserService' | 'authenticationService' | 'surveyService' | 'userService'
>): UserController => {
  const submissions = async (
    req: Request<any, any, any, { surveyId: string | string[] }>,
    res: Response
  ): Promise<void> => {
    const { surveyId } = req.query;
    const { id: userId } = req.user as User;

    const data = await surveyService.getSubmissions({ userId, surveyId });

    res.json(data);
  };

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

  const updatePassword = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { id } = req.user as User;
    const { passwordCurrent, password } = req.body;

    const userPassword = await UserPassword.findByPk(id);

    if (
      !userPassword ||
      !(await authenticationService.verifyPassword(passwordCurrent, userPassword))
    )
      throw new ValidationError('passwordCurrent', 'Enter your current valid password.');

    await adminUserService.updatePassword(id, password);

    res.json();
  };

  return {
    getPhysicalData,
    setPhysicalData,
    submissions,
    updatePassword,
  };
};
