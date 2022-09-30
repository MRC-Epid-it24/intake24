import { Column, DataType, Scopes, Table } from 'sequelize-typescript';

import type { FoodIndexBackendAttributes } from '@intake24/common/types/models';

import BaseModel from '../model';

@Scopes(() => ({
  list: {
    attributes: ['id', 'flag', 'description'],
    order: [['id', 'ASC']],
  },
}))
@Table({
  modelName: 'FoodIndexBackend',
  tableName: 'food_index_language_backends',
  freezeTableName: true,
  underscored: true,
})
export default class FoodIndexBackend
  extends BaseModel<FoodIndexBackendAttributes>
  implements FoodIndexBackendAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(16),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public flag!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public description!: string;
}
