import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { FoodsLocale } from '.';

@Table({
  modelName: 'FoodLocalList',
  tableName: 'foods_local_lists',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodLocalList extends BaseModel<
  InferAttributes<FoodLocalList>,
  InferCreationAttributes<FoodLocalList>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(8),
  })
  declare foodCode: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;
}

export type FoodLocalListAttributes = Attributes<FoodLocalList>;
export type FoodLocalListCreationAttributes = CreationAttributes<FoodLocalList>;
