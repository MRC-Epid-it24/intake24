import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { decode } from 'jsonwebtoken';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  PersonalAccessTokenEntry,
  PersonalAccessTokensResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { InternalServerError, NotFoundError } from '@intake24/api/http/errors';
import { PersonalAccessToken } from '@intake24/db';

const personalAccessTokenController = ({ jwtService }: Pick<IoC, 'jwtService'>) => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<PersonalAccessTokensResponse>
  ): Promise<void> => {
    const { userId } = req.scope.cradle;

    const tokens = await PersonalAccessToken.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      attributes: ['id', 'userId', 'name', 'createdAt', 'revoked', 'usedAt', 'expiresAt'],
      where: { userId },
      order: [['name', 'ASC']],
    });

    res.json(tokens);
  };

  const store = async (
    req: Request<any, any, { name: string; expiresAt: Date }>,
    res: Response<PersonalAccessTokenEntry>
  ): Promise<void> => {
    const { name, expiresAt } = req.body;
    const { userId } = req.scope.cradle;

    const jwt = await jwtService.signAccessToken({ userId }, 'admin', {
      audience: ['access', 'admin', 'personal'],
      expiresIn: Math.trunc((expiresAt.getTime() - Date.now()) / 1000),
    });
    const { jti } = decode(jwt) as JwtPayload;
    if (!jti) throw new InternalServerError();

    const token = await PersonalAccessToken.create({ userId, name, token: jti, expiresAt });

    res.status(201).json({ jwt, token });
  };

  const revoke = async (
    req: Request<{ tokenId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { tokenId: id } = req.params;
    const { userId } = req.scope.cradle;

    const token = await PersonalAccessToken.findOne({ where: { id, userId } });
    if (!token) throw new NotFoundError();

    await token.update({ revoked: true });

    res.json();
  };

  return {
    browse,
    store,
    revoke,
  };
};

export default personalAccessTokenController;

export type PersonalAccessTokenController = ReturnType<typeof personalAccessTokenController>;
