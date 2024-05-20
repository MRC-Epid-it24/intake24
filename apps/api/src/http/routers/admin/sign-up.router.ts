import { initServer } from '@ts-rest/express';

import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';

import { captchaCheck } from '../../rules';
import { attachRefreshToken } from '../util';

export function signUp() {
  return initServer().router(contract.admin.signUp, {
    signUp: async ({ req, res }) => {
      const {
        body: { name, email, phone, password, captcha },
        headers: { 'user-agent': userAgent },
      } = req;

      await captchaCheck(captcha, ioc.cradle.servicesConfig.captcha);

      await req.scope.cradle.adminSignupService.signUp(
        { name, email, phone, password },
        { notify: true, userAgent },
      );

      const result = await req.scope.cradle.authenticationService.adminLogin(
        { email, password },
        { req },
      );
      if ('devices' in result)
        return { status: 200, body: result };

      attachRefreshToken(
        result.refreshToken,
        res,
        req.scope.cradle.securityConfig.jwt.admin.cookie,
      );
      return { status: 200, body: { accessToken: result.accessToken } };
    },
    verify: async ({ body, req }) => {
      const { token } = body;

      await req.scope.cradle.adminSignupService.verify(token);

      return { status: 200, body: undefined };
    },
  });
}
