import type { Model as BaseModel } from 'sequelize-typescript';

import type { UserSecurableAttributes } from '@intake24/common/types/models';
import type { FindOptions, Includeable } from '@intake24/db';

export interface Securable extends BaseModel {
  ownerId: string | null;
  securables?: UserSecurableAttributes[];
}

export const securableScope = (userId: string): FindOptions => ({
  include: [
    { association: 'securables', required: false, where: { userId } },
    { association: 'owner', required: false, attributes: ['id', 'name', 'email'] },
  ],
});

export const securableIncludes = (userId: string): Includeable[] => [
  { association: 'securables', required: false, where: { userId } },
  { association: 'owner', required: false, attributes: ['id', 'name', 'email'] },
];
