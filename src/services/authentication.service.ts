import bcrypt from 'bcryptjs';
import User from '@/db/models/system/user';
import UserPassword from '@/db/models/system/user-password';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import ApplicationError from '@/http/errors/application.error';
import UnauthorizedError from '@/http/errors/unauthorized.error';
import { btoa } from '@/util';
import jwtSvc, { Subject, TokenPayload, Tokens } from './jwt.service';
import logger from './logger';

export default {
  async emailLogin(email: string, password: string): Promise<Tokens> {
    const user = await User.scope(['legacyPassword', 'roles']).findOne({ where: { email } });

    const subject: Subject = { providerID: 'email', providerKey: email };

    return this.login(user, password, subject);
  },

  async aliasLogin(userName: string, password: string, surveyId: string): Promise<Tokens> {
    const user = await User.scope(['legacyPassword', 'roles']).findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: { userName, surveyId },
        },
        { model: UserPassword },
      ],
    });

    const subject: Subject = { providerID: 'surveyAlias', providerKey: `${surveyId}#${userName}` };

    return this.login(user, password, subject);
  },

  async tokenLogin(token: string): Promise<Tokens> {
    const user = await User.scope('roles').findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: { urlAuthToken: token },
        },
        { model: UserPassword },
      ],
    });

    const subject: Subject = { providerID: 'URLToken', providerKey: token };

    return this.login(user, '', subject);
  },

  async login(user: User | null, password: string, subject: Subject): Promise<Tokens> {
    if (
      !user ||
      (subject.providerID !== 'URLToken' && !(await this.verifyPassword(password, user)))
    )
      throw new ApplicationError(`Provided credentials doesn't match with our records.`);

    const payload: TokenPayload = { userId: user.id, roles: user.roleList() };

    return jwtSvc.signTokens(payload, { subject: btoa(subject) });
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
      const { userId, sub: subject } = await jwtSvc.verifyRefreshToken(token);
      const user = await User.scope('roles').findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const roles = user.roleList();
      return await jwtSvc.signAccessToken({ userId, roles }, { subject });
    } catch (err) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
      throw new UnauthorizedError();
    }
  },
};
