import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { RefreshToken } from '@/db/models/system';
import type { IoC } from '@/ioc';
import type { TokenPayload } from './jwt.service';

export const decode = (token: string): TokenPayload => jwt.decode(token) as TokenPayload;

export interface JwtRotationService {
  save: (userId: number, token: string) => Promise<void>;
  revoke: (token: string) => Promise<void>;
  revokeByUser: (userId: number) => Promise<void>;
  verify: (token: string) => Promise<boolean>;
  verifyAndRevoke: (token: string) => Promise<boolean>;
  purge: () => Promise<void>;
}

export default ({ logger }: IoC): JwtRotationService => {
  const save = async (userId: number, token: string): Promise<void> => {
    const { jti: id, exp } = decode(token);

    RefreshToken.create({ id, userId, revoked: false, expiresAt: new Date(exp * 1000) });
  };

  const revoke = async (token: string): Promise<void> => {
    const { jti: id } = decode(token);

    await RefreshToken.update({ revoked: true }, { where: { id } });
  };

  const revokeByUser = async (userId: number): Promise<void> => {
    await RefreshToken.update({ revoked: true }, { where: { userId } });
  };

  const verify = async (token: string): Promise<boolean> => {
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
  };

  const verifyAndRevoke = async (token: string): Promise<boolean> => {
    const valid = await verify(token);
    await revoke(token);
    return valid;
  };

  const purge = async (): Promise<void> => {
    const selected = await RefreshToken.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });

    logger.debug(`JWT-Rotation: Expired refresh tokens (${selected}) have been purged.`);
  };

  return {
    save,
    revoke,
    revokeByUser,
    verify,
    verifyAndRevoke,
    purge,
  };
};
