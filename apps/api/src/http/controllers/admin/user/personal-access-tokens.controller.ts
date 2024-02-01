import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  PersonalAccessTokenEntry,
  PersonalAccessTokensResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { PersonalAccessToken } from '@intake24/db';

const personalAccessTokenController = ({ jwtService }: Pick<IoC, 'jwtService'>) => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<PersonalAccessTokensResponse>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;

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
    const { aal, verified, userId } = req.scope.cradle.user;

    const { jwt, token } = await jwtService.issuePersonalAccessToken(
      name,
      { aal, verified, userId },
      expiresAt
    );

    res.status(201).json({ jwt, token });
  };

  const revoke = async (
    req: Request<{ tokenId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { tokenId } = req.params;
    const { userId } = req.scope.cradle.user;

    await jwtService.revokePersonalAccessToken(tokenId, userId);

    res.status(204).json();
  };

  return {
    browse,
    store,
    revoke,
  };
};

export default personalAccessTokenController;

export type PersonalAccessTokenController = ReturnType<typeof personalAccessTokenController>;
