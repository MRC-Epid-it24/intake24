import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { RefreshToken } from '@/db/models/system';
import logger from '@/services/logger';
import { TokenPayload } from './jwt.service';

export const decode = (token: string): TokenPayload => jwt.decode(token) as TokenPayload;

export default {
  async save(userId: number, token: string): Promise<void> {
    const { jti: id, exp } = decode(token);

    RefreshToken.create({ id, userId, revoked: false, expiresAt: new Date(exp * 1000) });
  },

  async revoke(token: string): Promise<void> {
    const { jti: id } = decode(token);

    await RefreshToken.update({ revoked: true }, { where: { id } });
  },

  async revokeByUser(userId: number): Promise<void> {
    await RefreshToken.update({ revoked: true }, { where: { userId } });
  },

  async verify(token: string): Promise<boolean> {
    const { jti } = decode(token);

    const refreshToken = await RefreshToken.findByPk(jti);

    if (!refreshToken) {
      logger.debug('JWT-Rotation: Refresh token not found.');
      return false;
    }

    if (refreshToken.revoked) {
      logger.debug('JWT-Rotation: Refresh token revoked.');
      return false;
    }

    if (refreshToken.expiresAt <= new Date()) {
      logger.debug('JWT-Rotation: Refresh token expired.');
      return false;
    }

    return true;
  },

  async verifyAndRevoke(token: string): Promise<boolean> {
    const valid = await this.verify(token);
    await this.revoke(token);
    return valid;
  },

  async purge(): Promise<void> {
    const selected = await RefreshToken.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });

    logger.debug(`JWT-Rotation: Expired refresh tokens (${selected}) have been purged.`);
  },
};
