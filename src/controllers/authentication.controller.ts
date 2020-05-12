import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import ms from 'ms';
import config from '@/config/auth';
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
 * @param {TokenPayload} payload
 * @param {Response} res
 * @returns {Promise<void>}
 */
const sendTokenResponse = async (payload: TokenPayload, res: Response): Promise<void> => {
  const { name, httpOnly, maxAge, path, secure, sameSite } = config.jwt.cookie;

  const { accessToken, refreshToken } = await jwtSvc.signTokens(payload);

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
 * @returns {boolean}
 */
const checkPassword = (password: string, user: User): boolean => {
  if (user.password) return bcrypt.compareSync(password, user.password);

  // TODO: verify user.legacyPassword
  return false;
};

export default {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    const user = await User.scope(['legacyPassword', 'roles']).findOne({ where: { email } });

    if (!user || !checkPassword(password, user)) {
      next(new ApplicationError(`Provided credentials doesn't match with our records.`));
      return;
    }

    const roles = user.roleList();
    sendTokenResponse({ userId: user.id, roles }, res);
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

    if (!user || !checkPassword(password, user)) {
      next(new ApplicationError(`Provided credentials doesn't match with our records.`));
      return;
    }

    const roles = user.roleList();
    sendTokenResponse({ userId: user.id, roles }, res);
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

    const roles = user.roleList();
    await sendTokenResponse({ userId: user.id, roles }, res);
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
