import { Request, Response } from 'express';
import ms from 'ms';
import { UnauthorizedError } from '@/http/errors';
import type { IoC } from '@/ioc';
import type { Tokens } from '@/services/auth/jwt.service';
import { LoginResponse, MfaResponse, RefreshResponse } from '@common/types/http';
import { Controller } from './controller';

export type AuthenticationController = Controller<
  'emailLogin' | 'aliasLogin' | 'tokenLogin' | 'verify' | 'refresh' | 'logout'
>;

export default ({
  config,
  authenticationService,
  jwtRotationService,
}: IoC): AuthenticationController => {
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
    const { name, httpOnly, maxAge, path, secure, sameSite } = config.security.jwt.cookie;

    res
      .cookie(name, refreshToken, {
        maxAge: typeof maxAge === 'string' ? ms(maxAge) : maxAge,
        httpOnly,
        path,
        sameSite,
        secure,
      })
      .json({ accessToken });
  };

  const emailLogin = async (
    req: Request,
    res: Response<LoginResponse | MfaResponse>
  ): Promise<void> => {
    const { email, password } = req.body;

    const result = await authenticationService.emailLogin(email, password);
    if ('mfa' in result) {
      res.json(result);
      return;
    }

    await sendTokenResponse(result, res);
  };

  const aliasLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { userName, password, surveyId } = req.body;

    const tokens = await authenticationService.aliasLogin(userName, password, surveyId);

    await sendTokenResponse(tokens, res);
  };

  const tokenLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { token } = req.body;
    if (!token) throw new UnauthorizedError();

    const tokens = await authenticationService.tokenLogin(token);

    await sendTokenResponse(tokens, res);
  };

  const verify = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { sigResponse } = req.body;
    if (!sigResponse) throw new UnauthorizedError();

    const tokens = await authenticationService.verifyMfa(sigResponse);
    await sendTokenResponse(tokens, res);
  };

  const refresh = async (req: Request, res: Response<RefreshResponse>): Promise<void> => {
    const { name } = config.security.jwt.cookie;
    const refreshToken = req.cookies[name];
    if (!refreshToken) throw new UnauthorizedError();

    const tokens = await authenticationService.refresh(refreshToken);
    await sendTokenResponse(tokens, res);
  };

  const logout = async (req: Request, res: Response): Promise<void> => {
    const { name, httpOnly, path, secure, sameSite } = config.security.jwt.cookie;

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
