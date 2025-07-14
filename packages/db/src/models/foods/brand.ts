import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';

import { Food } from '@intake24/db';

import BaseModel from '../model';

@Table({
  modelName: 'Brand',
  tableName: 'brands',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Brand extends BaseModel<
  InferAttributes<Brand>,
  InferCreationAttributes<Brand>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare name: string;

  @BelongsTo(() => Food, 'foodId')
  declare food?: NonAttribute<Food>;
}

export type BrandAttributes = Attributes<Brand>;
export type BrandCreationAttributes = CreationAttributes<Brand>;
