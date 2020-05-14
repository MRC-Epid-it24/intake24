import { Request, Response } from 'express';
import ms from 'ms';
import config from '@/config/security';
import authSvc from '@/services/authentication.service';
import { Tokens } from '@/services/jwt.service';

/**
 * Sucessfull login response helper
 * - attach refresh token as secure cookie
 * - return access token in response body
 *
 * @param {Tokens} tokens
 * @param {Response} res
 * @returns {Promise<void>}
 */
const sendTokenResponse = async (
  { accessToken, refreshToken }: Tokens,
  res: Response
): Promise<void> => {
  const { name, httpOnly, maxAge, path, secure, sameSite } = config.jwt.cookie;

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

export default {
  async emailLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const tokens = await authSvc.emailLogin(email, password);

    await sendTokenResponse(tokens, res);
  },

  async aliasLogin(req: Request, res: Response): Promise<void> {
    const { userName, password, surveyId } = req.body;

    const tokens = await authSvc.aliasLogin(userName, password, surveyId);

    await sendTokenResponse(tokens, res);
  },

  async tokenLogin(req: Request, res: Response): Promise<void> {
    const { token } = req.params;

    const tokens = await authSvc.tokenLogin(token);

    await sendTokenResponse(tokens, res);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { name } = config.jwt.cookie;
    const accessToken = await authSvc.refresh(req.cookies[name]);
    res.json({ accessToken });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { name, httpOnly, path, secure, sameSite } = config.jwt.cookie;
    res.cookie(name, '', { maxAge: -1, httpOnly, path, secure, sameSite }).json();
  },
};
