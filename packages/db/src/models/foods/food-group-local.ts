import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { FoodGroup, FoodsLocale } from '.';

@Table({
  modelName: 'FoodGroupLocal',
  tableName: 'food_group_locals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroupLocal extends BaseModel<
  InferAttributes<FoodGroupLocal>,
  InferCreationAttributes<FoodGroupLocal>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodGroupId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  declare name: string;

  @BelongsTo(() => FoodGroup, 'foodGroupId')
  declare group?: NonAttribute<FoodGroup>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;
}

export type FoodGroupLocalAttributes = Attributes<FoodGroupLocal>;
export type FoodGroupLocalCreationAttributes = CreationAttributes<FoodGroupLocal>;
