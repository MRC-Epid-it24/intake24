import { Request, Response } from 'express';
import { LoginResponse, MFAResponse, RefreshResponse } from '@intake24/common/types/http';
import { UnauthorizedError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Tokens } from '@intake24/api/services/core/auth';
import { Controller } from './controller';

export type AuthenticationController = Controller<
  'emailLogin' | 'aliasLogin' | 'tokenLogin' | 'verify' | 'refresh' | 'logout'
>;

export default ({
  authenticationService,
  jwtRotationService,
  mfaProvider,
  securityConfig,
}: Pick<
  IoC,
  'authenticationService' | 'jwtRotationService' | 'mfaProvider' | 'securityConfig'
>): AuthenticationController => {
  /**
   * Successful login response helper
   * - attach refresh token as secure cookie
   * - return access token in response body
   *
   * @param {Tokens} tokens
   * @param {Response} res
   * @returns {Promise<void>}
   */
  const sendTokenResponse = async (
    { accessToken, refreshToken }: Tokens,
    res: Response<LoginResponse>
  ): Promise<void> => {
    const { name, httpOnly, maxAge, path, secure, sameSite } = securityConfig.jwt.cookie;

    res
      .cookie(name, refreshToken, { maxAge, httpOnly, path, sameSite, secure })
      .json({ accessToken });
  };

  const emailLogin = async (
    req: Request,
    res: Response<LoginResponse | MFAResponse>
  ): Promise<void> => {
    const { email, password } = req.body;

    const result = await authenticationService.emailLogin({ email, password }, { req });
    if ('mfaRequestUrl' in result) {
      res.json(result);
      return;
    }

    await sendTokenResponse(result, res);
  };

  const aliasLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { userName, password, surveyId } = req.body;

    const tokens = await authenticationService.aliasLogin(
      { userName, password, surveyId },
      { req }
    );

    await sendTokenResponse(tokens, res);
  };

  const tokenLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { token } = req.body;

    if (typeof token !== 'string' || !token) throw new UnauthorizedError();

    const tokens = await authenticationService.tokenLogin({ token }, { req });

    await sendTokenResponse(tokens, res);
  };

  const verify = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { code, state } = req.body;

    try {
      const tokens = await mfaProvider.verify({ code, state }, { req });
      await sendTokenResponse(tokens, res);
    } finally {
      delete req.session.duo;
    }
  };

  const refresh = async (req: Request, res: Response<RefreshResponse>): Promise<void> => {
    const { name } = securityConfig.jwt.cookie;
    const refreshToken = req.cookies[name];
    if (!refreshToken) throw new UnauthorizedError();

    const tokens = await authenticationService.refresh(refreshToken);
    await sendTokenResponse(tokens, res);
  };

  const logout = async (req: Request, res: Response): Promise<void> => {
    const { name, httpOnly, path, secure, sameSite } = securityConfig.jwt.cookie;

    const refreshToken = req.cookies[name];
    if (refreshToken) await jwtRotationService.revoke(refreshToken);

    res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite }).json();
  };

  return {
    emailLogin,
    aliasLogin,
    tokenLogin,
    verify,
    refresh,
    logout,
  };
};
