import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import ms from 'ms';
import config from '@/config/security';
import User from '@/db/models/system/user';
import UserSurveyAliases from '@/db/models/system/user-survey-alias';
import UserPassword from '@/db/models/system/user-password';
import ApplicationError from '@/http/errors/application.error';
import authSvc from '@/services/authentication.service';
import jwtSvc, { TokenPayload } from '@/services/jwt.service';

/**
 * Sucessfull login response helper
 * - sign access & refresh token
 * - attach refresh token as secure cookie
 * - return access token in response body
 *
 * @param {User} user
 * @param {Response} res
 * @returns {Promise<void>}
 */
const sendTokenResponse = async (user: User, res: Response): Promise<void> => {
  const payload: TokenPayload = {
    userId: user.id,
    roles: user.roleList(),
  };

  const { accessToken, refreshToken } = await jwtSvc.signTokens(payload);

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

/**
 * Verify user's password
 * Includes legacy fallback (TODO: to implement)
 *
 * @param {string} password
 * @param {User} user
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password: string, user: User): Promise<boolean> => {
  if (user.password) return bcrypt.compare(password, user.password);

  // TODO: verify user.legacyPassword
  return false;
};

export default {
  async emailLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    const user = await User.scope(['legacyPassword', 'roles']).findOne({ where: { email } });

    if (!user || !(await verifyPassword(password, user))) {
      next(new ApplicationError(`Provided credentials doesn't match with our records.`));
      return;
    }

    await sendTokenResponse(user, res);
  },

  async aliasLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userName, password, surveyId } = req.body;

    const user = await User.scope(['legacyPassword', 'roles']).findOne({
      include: [
        {
          model: UserSurveyAliases,
          where: { userName, surveyId },
        },
        { model: UserPassword },
      ],
    });

    if (!user || !(await verifyPassword(password, user))) {
      next(new ApplicationError(`Provided credentials doesn't match with our records.`));
      return;
    }

    await sendTokenResponse(user, res);
  },

  async tokenLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { token } = req.params;

    const user = await User.scope('roles').findOne({
      include: [
        {
          model: UserSurveyAliases,
          where: { urlAuthToken: token },
        },
        { model: UserPassword },
      ],
    });

    if (!user) {
      next(new ApplicationError(`Provided credentials doesn't match with our records.`));
      return;
    }

    await sendTokenResponse(user, res);
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
