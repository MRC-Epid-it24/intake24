import type { Model as BaseModel } from 'sequelize-typescript';
import { Op } from 'sequelize';

import type { RecordVisibility } from '@intake24/common/security';
import type { FindOptions, Includeable, UserSecurableAttributes, WhereOptions } from '@intake24/db';

export interface Securable extends BaseModel {
  ownerId: string | null;
  securables?: UserSecurableAttributes[];
}

export interface HasVisibility extends Securable {
  visibility: RecordVisibility;
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

export const visibilityScope = (userId: string, where: WhereOptions = {}): FindOptions => ({
  where: {
    ...where,
    [Op.or]: { visibility: 'public', ownerId: userId, '$securables.action$': ['use'] },
  },
  ...securableScope(userId),
});
