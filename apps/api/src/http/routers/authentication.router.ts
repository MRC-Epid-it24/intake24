import type { Request } from 'express';
import { initServer } from '@ts-rest/express';

import { UnauthorizedError } from '@intake24/api/http/errors';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';

import { attachRefreshToken } from './util';

export function authentication() {
  const loginRateLimiter = ioc.cradle.rateLimiter.createMiddleware('login', {
    keyGenerator: req => `login:${req.body?.email ?? req.ip}`,
    message: (req: Request) => req.scope.cradle.i18nService.translate('rateLimit.login'),
    skipSuccessfulRequests: true,
  });

  return initServer().router(contract.public.authentication, {
    emailLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { email, password, survey, captcha } = body;

        const result = await req.scope.cradle.authenticationService.emailLogin(
          { email, password, survey, captcha },
          { req },
        );
        if ('provider' in result)
          return { status: 200, body: result };

        attachRefreshToken(
          result.refreshToken,
          res,
          req.scope.cradle.securityConfig.jwt.survey.cookie,
        );
        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    aliasLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { username, password, survey, captcha } = body;

        const result = await req.scope.cradle.authenticationService.aliasLogin(
          { username, password, survey, captcha },
          { req },
        );
        if ('provider' in result)
          return { status: 200, body: result };

        attachRefreshToken(
          result.refreshToken,
          res,
          req.scope.cradle.securityConfig.jwt.survey.cookie,
        );
        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    tokenLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { token, captcha } = body;

        const result = await req.scope.cradle.authenticationService.tokenLogin(
          { token, captcha },
          { req },
        );
        if ('provider' in result)
          return { status: 200, body: result };

        attachRefreshToken(
          result.refreshToken,
          res,
          req.scope.cradle.securityConfig.jwt.survey.cookie,
        );

        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    refresh: async ({ req, res }) => {
      const { name } = req.scope.cradle.securityConfig.jwt.survey.cookie;
      const refreshToken = req.cookies[name];
      if (!refreshToken)
        throw new UnauthorizedError();

      const tokens = await req.scope.cradle.authenticationService.refresh(refreshToken, 'survey');
      attachRefreshToken(
        tokens.refreshToken,
        res,
        req.scope.cradle.securityConfig.jwt.survey.cookie,
      );

      return { status: 200, body: { accessToken: tokens.accessToken } };
    },
    logout: async ({ req, res }) => {
      const { name, httpOnly, path, secure, sameSite }
        = req.scope.cradle.securityConfig.jwt.survey.cookie;

      const refreshToken = req.cookies[name];
      if (refreshToken)
        await req.scope.cradle.jwtRotationService.revoke(refreshToken);

      res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite });

      return { status: 200, body: undefined };
    },
  });
}
