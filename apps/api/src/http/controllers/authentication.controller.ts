import { Request, Response } from 'express';
import { LoginResponse, MfaResponse, RefreshResponse } from '@common/types/http';
import { UnauthorizedError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import type { Tokens, LoginMeta } from '@api/services/auth';
import { Controller } from './controller';

export type AuthenticationController = Controller<
  'emailLogin' | 'aliasLogin' | 'tokenLogin' | 'verify' | 'refresh' | 'logout'
>;

export default ({
  securityConfig,
  authenticationService,
  jwtRotationService,
}: Pick<
  IoC,
  'securityConfig' | 'authenticationService' | 'jwtRotationService'
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
    res: Response<LoginResponse | MfaResponse>
  ): Promise<void> => {
    const { email, password } = req.body;
    const meta: LoginMeta = { remoteAddress: req.ip, userAgent: req.headers['user-agent'] };

    const result = await authenticationService.emailLogin({ email, password }, meta);
    if ('mfa' in result) {
      res.json(result);
      return;
    }

    await sendTokenResponse(result, res);
  };

  const aliasLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { userName, password, surveyId } = req.body;
    const meta: LoginMeta = { remoteAddress: req.ip, userAgent: req.headers['user-agent'] };

    const tokens = await authenticationService.aliasLogin({ userName, password, surveyId }, meta);

    await sendTokenResponse(tokens, res);
  };

  const tokenLogin = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { token } = req.body;
    const meta: LoginMeta = { remoteAddress: req.ip, userAgent: req.headers['user-agent'] };

    if (!token) throw new UnauthorizedError();

    const tokens = await authenticationService.tokenLogin({ token }, meta);

    await sendTokenResponse(tokens, res);
  };

  const verify = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { sigResponse } = req.body;
    const meta: LoginMeta = { remoteAddress: req.ip, userAgent: req.headers['user-agent'] };

    if (!sigResponse) throw new UnauthorizedError();

    const tokens = await authenticationService.verifyMfa({ sigResponse }, meta);
    await sendTokenResponse(tokens, res);
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
