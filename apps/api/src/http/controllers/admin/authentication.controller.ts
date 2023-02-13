import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Tokens } from '@intake24/api/services/core/auth';
import type { LoginResponse, MFAAuthResponse, RefreshResponse } from '@intake24/common/types/http';
import { UnauthorizedError } from '@intake24/api/http/errors';

const adminAuthenticationController = ({
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
    const { name, httpOnly, maxAge, path, secure, sameSite } = securityConfig.jwt.admin.cookie;

    res
      .cookie(name, refreshToken, { maxAge, httpOnly, path, sameSite, secure })
      .json({ accessToken });
  };

  const login = async (
    req: Request,
    res: Response<LoginResponse | MFAAuthResponse>
  ): Promise<void> => {
    const { email, password } = req.body;

    const result = await authenticationService.adminLogin({ email, password }, { req });
    if ('devices' in result) {
      res.json(result);
      return;
    }

    sendTokenResponse(result, res);
  };

  const verify = async (
    req: Request /*<any, any, MFAAuthenticationVerificationRequest>*/,
    res: Response<LoginResponse>
  ): Promise<void> => {
    const { token, response } = req.body;

    const tokens = await authenticationService.verify({ token, response }, { req });

    sendTokenResponse(tokens, res);
  };

  const refresh = async (req: Request, res: Response<RefreshResponse>): Promise<void> => {
    const { name } = securityConfig.jwt.admin.cookie;
    const refreshToken = req.cookies[name];
    if (!refreshToken) throw new UnauthorizedError();

    const tokens = await authenticationService.refresh(refreshToken, 'admin');
    sendTokenResponse(tokens, res);
  };

  const logout = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { name, httpOnly, path, secure, sameSite } = securityConfig.jwt.admin.cookie;

    const refreshToken = req.cookies[name];
    if (refreshToken) await jwtRotationService.revoke(refreshToken);

    res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite }).json();
  };

  return {
    sendTokenResponse,
    login,
    verify,
    refresh,
    logout,
  };
};

export default adminAuthenticationController;

export type AdminAuthenticationController = ReturnType<typeof adminAuthenticationController>;
