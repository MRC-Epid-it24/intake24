import type { Request, Response } from 'express';
import { initServer } from '@ts-rest/express';

import type { CookieSettings } from '@intake24/api/config/common';
import type { Tokens } from '@intake24/api/services';
import { UnauthorizedError } from '@intake24/api/http/errors';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';

export const authentication = () => {
  const loginRateLimiter = ioc.cradle.rateLimiter.createMiddleware('login', {
    message: (req: Request) => req.scope.cradle.i18nService.translate('rateLimit.login'),
    skipSuccessfulRequests: true,
  });

  const attachRefreshToken = (tokens: Tokens, res: Response, cookie: CookieSettings) => {
    const { refreshToken } = tokens;
    const { name, httpOnly, maxAge, path, secure, sameSite } = cookie;

    res.cookie(name, refreshToken, { maxAge, httpOnly, path, sameSite, secure });
  };

  return initServer().router(contract.public.authentication, {
    emailLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { email, password, survey, captcha } = body;

        const result = await req.scope.cradle.authenticationService.emailLogin(
          { email, password, survey, captcha },
          { req }
        );
        if ('provider' in result) return { status: 200, body: result };

        attachRefreshToken(result, res, req.scope.cradle.securityConfig.jwt.survey.cookie);
        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    aliasLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { username, password, survey, captcha } = body;

        const result = await req.scope.cradle.authenticationService.aliasLogin(
          { username, password, survey, captcha },
          { req }
        );
        if ('provider' in result) return { status: 200, body: result };

        attachRefreshToken(result, res, req.scope.cradle.securityConfig.jwt.survey.cookie);
        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    tokenLogin: {
      middleware: [loginRateLimiter],
      handler: async ({ body, req, res }) => {
        const { token, captcha } = body;

        const result = await req.scope.cradle.authenticationService.tokenLogin(
          { token, captcha },
          { req }
        );
        if ('provider' in result) return { status: 200, body: result };

        attachRefreshToken(result, res, req.scope.cradle.securityConfig.jwt.survey.cookie);

        return { status: 200, body: { accessToken: result.accessToken } };
      },
    },
    refresh: async ({ req, res }) => {
      const { name } = req.scope.cradle.securityConfig.jwt.survey.cookie;
      const refreshToken = req.cookies[name];
      if (!refreshToken) throw new UnauthorizedError();

      const tokens = await req.scope.cradle.authenticationService.refresh(refreshToken, 'survey');
      attachRefreshToken(tokens, res, req.scope.cradle.securityConfig.jwt.survey.cookie);

      return { status: 200, body: { accessToken: tokens.accessToken } };
    },
    logout: async ({ req, res }) => {
      const { name, httpOnly, path, secure, sameSite } =
        req.scope.cradle.securityConfig.jwt.survey.cookie;

      const refreshToken = req.cookies[name];
      if (refreshToken) await req.scope.cradle.jwtRotationService.revoke(refreshToken);

      res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite });

      return { status: 200, body: undefined };
    },
  });
};
