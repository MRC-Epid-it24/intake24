import type { Request, Response } from 'express';
import type { User } from '@intake24/db';
import { UserPassword } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from '../controller';
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
      throw new ValidationError('Enter your current valid password.', { param: 'passwordCurrent' });

    await adminUserService.updatePassword(id, password);

    res.json();
  };

  return { updatePassword };
};
