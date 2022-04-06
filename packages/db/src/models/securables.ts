import { Model as BaseModel } from 'sequelize-typescript';
import { UserSecurableAttributes } from '@intake24/common/types/models';

export interface Securable extends BaseModel {
  ownerId: string | null;
  securables?: UserSecurableAttributes[];
}

export const securableScope = (userId: string) => ({
  include: [{ association: 'securables', required: false, where: { userId } }],
});
