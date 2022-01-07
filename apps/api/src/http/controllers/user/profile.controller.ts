import { Request, Response } from 'express';
import { User, UserPassword } from '@intake24/db';
import type { IoC } from '@api/ioc';
import { Controller } from '../controller';
import { ValidationError } from '../../errors';

export type UserProfileController = Controller<'updatePassword'>;

export default ({
  adminUserService,
  authenticationService,
}: Pick<
  IoC,
  'adminUserService' | 'authenticationService' | 'surveyService' | 'userService'
>): UserProfileController => {
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

  return { updatePassword };
};
