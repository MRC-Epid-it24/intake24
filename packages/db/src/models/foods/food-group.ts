import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';

import { Food, FoodGroupLocal } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'FoodGroup',
  tableName: 'food_groups',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroup extends BaseModel<
  InferAttributes<FoodGroup>,
  InferCreationAttributes<FoodGroup>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  declare name: string;

  @HasMany(() => FoodGroupLocal, 'foodGroupId')
  declare localGroups?: NonAttribute<FoodGroupLocal[]>;

  @HasMany(() => Food, 'foodGroupId')
  declare foods?: NonAttribute<Food[]>;
}

export type FoodGroupAttributes = Attributes<FoodGroup>;
export type FoodGroupCreationAttributes = CreationAttributes<FoodGroup>;
