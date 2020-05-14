import User from '@/db/models/system/user';
import UnauthorizedError from '@/http/errors/unauthorized.error';
import jwtSvc from './jwt.service';

export default {
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
