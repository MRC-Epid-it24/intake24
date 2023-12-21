import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Tokens } from '@intake24/api/services/core/auth';
import type {
  ChallengeResponse,
  LoginResponse,
  RefreshResponse,
} from '@intake24/common/types/http';
import { UnauthorizedError } from '@intake24/api/http/errors';

const authenticationController = ({
  authenticationService,
  jwtRotationService,
  securityConfig,
}: Pick<IoC, 'authenticationService' | 'jwtRotationService' | 'securityConfig'>) => {
  /**
   * Successful login response helper
   * - attach refresh token as secure cookie
   * - return access token in response body
   *
   * @param {Tokens} tokens
   * @param {Response<LoginResponse>} res
   */
  const sendTokenResponse = (tokens: Tokens, res: Response<LoginResponse>) => {
    const { accessToken, refreshToken } = tokens;
    const { name, httpOnly, maxAge, path, secure, sameSite } = securityConfig.jwt.survey.cookie;

    res
      .cookie(name, refreshToken, { maxAge, httpOnly, path, sameSite, secure })
      .json({ accessToken });
  };

  const emailLogin = async (
    req: Request,
    res: Response<LoginResponse | ChallengeResponse>
  ): Promise<void> => {
    const { email, password, survey, captcha } = req.body;

    const result = await authenticationService.emailLogin(
      { email, password, survey, captcha },
      { req }
    );
    if ('provider' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  const aliasLogin = async (
    req: Request,
    res: Response<LoginResponse | ChallengeResponse>
  ): Promise<void> => {
    const { username, password, survey, captcha } = req.body;

    const result = await authenticationService.aliasLogin(
      { username, password, survey, captcha },
      { req }
    );
    if ('provider' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  const tokenLogin = async (
    req: Request,
    res: Response<LoginResponse | ChallengeResponse>
  ): Promise<void> => {
    const { token, captcha } = req.body;

    if (typeof token !== 'string' || !token) throw new UnauthorizedError();

    const result = await authenticationService.tokenLogin({ token, captcha }, { req });
    if ('provider' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  const refresh = async (req: Request, res: Response<RefreshResponse>): Promise<void> => {
    const { name } = securityConfig.jwt.survey.cookie;
    const refreshToken = req.cookies[name];
    if (!refreshToken) throw new UnauthorizedError();

    const tokens = await authenticationService.refresh(refreshToken, 'survey');

    sendTokenResponse(tokens, res);
  };

  const logout = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { name, httpOnly, path, secure, sameSite } = securityConfig.jwt.survey.cookie;

    const refreshToken = req.cookies[name];
    if (refreshToken) await jwtRotationService.revoke(refreshToken);

    res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite }).json();
  };

  return {
    emailLogin,
    aliasLogin,
    tokenLogin,
    refresh,
    logout,
  };
};

export default authenticationController;

export type AuthenticationController = ReturnType<typeof authenticationController>;
