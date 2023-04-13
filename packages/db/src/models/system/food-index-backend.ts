import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, DataType, Scopes, Table } from 'sequelize-typescript';

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
export default class FoodIndexBackend extends BaseModel<
  InferAttributes<FoodIndexBackend>,
  InferCreationAttributes<FoodIndexBackend>
> {
  @Column({
    primaryKey: true,
    type: DataType.STRING(16),
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare flag: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  declare description: string;
}

export type FoodIndexBackendAttributes = Attributes<FoodIndexBackend>;
export type FoodIndexBackendCreationAttributes = CreationAttributes<FoodIndexBackend>;
