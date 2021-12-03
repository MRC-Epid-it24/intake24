import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { RefreshToken } from '@api/db/models/system';
import type { IoC } from '@api/ioc';
import type { TokenPayload } from '.';

export const decode = (token: string): TokenPayload => jwt.decode(token) as TokenPayload;

const jwtRotationService = (ops: Pick<IoC, 'logger'>) => {
  const logger = ops.logger.child({ service: 'JwtRotationService' });

  /**
   * Store new refresh token to database
   *
   * @param {string} token
   * @param {string} userId
   * @returns {Promise<RefreshToken>}
   */
  const store = async (token: string, userId: string): Promise<RefreshToken> => {
    const { jti: id, exp } = decode(token);

    return RefreshToken.create({
      id,
      userId,
      revoked: false,
      expiresAt: new Date(exp * 1000),
    });
  };

  /**
   * Revoke refresh token by ID
   *
   * @param {string} token
   * @returns {Promise<number>}
   */
  const revoke = async (token: string): Promise<number> => {
    const { jti: id } = decode(token);

    const [rows] = await RefreshToken.update({ revoked: true }, { where: { id } });

    return rows;
  };

  /**
   * Revoke refresh tokens by userId
   *
   * @param {string} userId
   * @returns {Promise<number>}
   */
  const revokeByUser = async (userId: string): Promise<number> => {
    const [rows] = await RefreshToken.update({ revoked: true }, { where: { userId } });

    return rows;
  };

  /**
   * Verify refresh token against database record
   *
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  const verify = async (token: string): Promise<boolean> => {
    const { jti } = decode(token);

    const refreshToken = await RefreshToken.findByPk(jti);

    if (!refreshToken) {
      logger.debug('Refresh token not found.');
      return false;
    }

    if (refreshToken.revoked) {
      logger.debug('Refresh token revoked.');
      return false;
    }

    if (refreshToken.expiresAt <= new Date()) {
      logger.debug('Refresh token expired.');
      return false;
    }

    return true;
  };

  /**
   * 1) Verify refresh token against database record
   * 2) Revoke refresh token for rotation
   *
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  const verifyAndRevoke = async (token: string): Promise<boolean> => {
    const valid = await verify(token);
    await revoke(token);
    return valid;
  };

  /**
   * Clean expired refresh tokens
   *
   * @returns {Promise<number>}
   */
  const purge = async (): Promise<number> => {
    const rows = await RefreshToken.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });

    logger.debug(`Expired refresh tokens (${rows}) have been purged.`);

    return rows;
  };

  return {
    store,
    revoke,
    revokeByUser,
    verify,
    verifyAndRevoke,
    purge,
  };
};

export default jwtRotationService;

export type JwtRotationService = ReturnType<typeof jwtRotationService>;
