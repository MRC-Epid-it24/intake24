import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LoginResponse, MFAAuthResponse } from '@intake24/common/types/http';

const adminSignupController = ({
  adminAuthenticationController,
  adminSignupService,
  authenticationService,
}: Pick<IoC, 'adminAuthenticationController' | 'authenticationService' | 'adminSignupService'>) => {
  const signUp = async (
    req: Request,
    res: Response<LoginResponse | MFAAuthResponse>
  ): Promise<void> => {
    const {
      body: { name, email, phone, password },
      headers: { 'user-agent': userAgent },
    } = req;

    await adminSignupService.signUp({ name, email, phone, password }, { notify: true, userAgent });

    const result = await authenticationService.adminLogin({ email, password }, { req });
    if ('devices' in result) {
      res.json(result);
      return;
    }

    adminAuthenticationController.sendTokenResponse(result, res);
  };

  const verify = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { token } = req.body;

    await adminSignupService.verify(token);

    res.json();
  };

  return { signUp, verify };
};

export default adminSignupController;

export type AdminSignupController = ReturnType<typeof adminSignupController>;
