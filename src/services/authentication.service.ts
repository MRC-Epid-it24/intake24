import bcrypt from 'bcryptjs';
import User from '@/db/models/system/user';
import UnauthorizedError from '@/http/errors/unauthorized.error';
import ApplicationError from '@/http/errors/application.error';
import UserSurveyAliases from '@/db/models/system/user-survey-alias';
import UserPassword from '@/db/models/system/user-password';
import jwtSvc, { TokenPayload, Tokens } from './jwt.service';

export default {
  async emailLogin(email: string, password: string): Promise<Tokens> {
    const user = await User.scope(['legacyPassword', 'roles']).findOne({ where: { email } });

    if (!user || !(await this.verifyPassword(password, user)))
      throw new ApplicationError(`Provided credentials doesn't match with our records.`);

    const payload: TokenPayload = { userId: user.id, roles: user.roleList() };

    return jwtSvc.signTokens(payload);
  },

  async aliasLogin(userName: string, password: string, surveyId: string): Promise<Tokens> {
    const user = await User.scope(['legacyPassword', 'roles']).findOne({
      include: [
        {
          model: UserSurveyAliases,
          where: { userName, surveyId },
        },
        { model: UserPassword },
      ],
    });

    if (!user || !(await this.verifyPassword(password, user)))
      throw new ApplicationError(`Provided credentials doesn't match with our records.`);

    const payload: TokenPayload = { userId: user.id, roles: user.roleList() };

    return jwtSvc.signTokens(payload);
  },

  async tokenLogin(token: string): Promise<Tokens> {
    const user = await User.scope('roles').findOne({
      include: [
        {
          model: UserSurveyAliases,
          where: { urlAuthToken: token },
        },
        { model: UserPassword },
      ],
    });

    if (!user) throw new ApplicationError(`Provided credentials doesn't match with our records.`);

    const payload: TokenPayload = { userId: user.id, roles: user.roleList() };

    return jwtSvc.signTokens(payload);
  },

  /**
   * Verify user's password
   * Includes legacy fallback (TODO: to implement)
   *
   * @param {string} password
   * @param {User} user
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password: string, user: User): Promise<boolean> {
    if (user.password) return bcrypt.compare(password, user.password);

    // TODO: verify user.legacyPassword
    return true;
  },

  /**
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @returns {Promise<string>}
   */
  async refresh(token: string): Promise<string> {
    try {
      const { userId } = await jwtSvc.verifyRefreshToken(token);
      const user = await User.scope('roles').findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const roles = user.roleList();
      return await jwtSvc.signAccessToken({ userId, roles });
    } catch (err) {
      throw new UnauthorizedError();
    }
  },
};
