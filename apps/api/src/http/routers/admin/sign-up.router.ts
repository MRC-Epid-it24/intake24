import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import { initServer } from '@ts-rest/express';

import { ValidationError } from '@intake24/api/http/errors';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';

import { unique } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';

import { User } from '@intake24/db';
import { captchaCheck } from '../../rules';
import { attachRefreshToken } from '../util';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { req }: { req: TsRestRequest<T> }) {
  if (!(await unique({ model: User, condition: { field: 'email', value } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'email' }), {
      path: 'email',
    });
  }
}

export function signUp() {
  return initServer().router(contract.admin.signUp, {
    signUp: async ({ req, res }) => {
      const {
        body: { name, email, phone, password, captcha },
        headers: { 'user-agent': userAgent },
      } = req;

      await captchaCheck(captcha, ioc.cradle.servicesConfig.captcha);
      await uniqueMiddleware(email, { req });

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
