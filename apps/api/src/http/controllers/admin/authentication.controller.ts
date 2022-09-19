import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Tokens } from '@intake24/api/services/core/auth';
import type { LoginResponse, MFAResponse, RefreshResponse } from '@intake24/common/types/http';
import { UnauthorizedError } from '@intake24/api/http/errors';

const adminAuthenticationController = ({
  adminUserService,
  authenticationService,
  jwtRotationService,
  mfaProvider,
  securityConfig,
}: Pick<
  IoC,
  | 'adminUserService'
  | 'authenticationService'
  | 'jwtRotationService'
  | 'mfaProvider'
  | 'securityConfig'
>) => {
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
    const { name, httpOnly, maxAge, path, secure, sameSite } = securityConfig.jwt.admin.cookie;

    res
      .cookie(name, refreshToken, { maxAge, httpOnly, path, sameSite, secure })
      .json({ accessToken });
  };

  const login = async (req: Request, res: Response<LoginResponse | MFAResponse>): Promise<void> => {
    const { email, password } = req.body;

    const result = await authenticationService.adminLogin({ email, password }, { req });
    if ('mfaRequestUrl' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  const verify = async (req: Request, res: Response<LoginResponse>): Promise<void> => {
    const { code, state } = req.body;

    try {
      const tokens = await mfaProvider.verify({ code, state }, { req });
      sendTokenResponse(tokens, res);
    } finally {
      delete req.session.duo;
    }
  };

  const refresh = async (req: Request, res: Response<RefreshResponse>): Promise<void> => {
    const { name } = securityConfig.jwt.admin.cookie;
    const refreshToken = req.cookies[name];
    if (!refreshToken) throw new UnauthorizedError();

    const tokens = await authenticationService.refresh(refreshToken, 'admin');
    sendTokenResponse(tokens, res);
  };

  const logout = async (req: Request, res: Response): Promise<void> => {
    const { name, httpOnly, path, secure, sameSite } = securityConfig.jwt.admin.cookie;

    const refreshToken = req.cookies[name];
    if (refreshToken) await jwtRotationService.revoke(refreshToken);

    res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite }).json();
  };

  const signup = async (
    req: Request,
    res: Response<LoginResponse | MFAResponse>
  ): Promise<void> => {
    const { name, email, phone, password } = req.body;

    await adminUserService.signUp({ name, email, phone, password });

    const result = await authenticationService.adminLogin({ email, password }, { req });
    if ('mfaRequestUrl' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  return {
    login,
    verify,
    refresh,
    logout,
    signup,
  };
};

export default adminAuthenticationController;

export type AdminAuthenticationController = ReturnType<typeof adminAuthenticationController>;
