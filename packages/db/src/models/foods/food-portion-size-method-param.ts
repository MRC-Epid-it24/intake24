import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { AsServedSet, FoodPortionSizeMethod, GuideImage, StandardUnit } from '.';

@Table({
  modelName: 'FoodPortionSizeMethodParameter',
  tableName: 'food_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodPortionSizeMethodParameter extends BaseModel<
  InferAttributes<FoodPortionSizeMethodParameter>,
  InferCreationAttributes<FoodPortionSizeMethodParameter>
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
  declare portionSizeMethodId: ForeignKey<FoodPortionSizeMethod['id']>;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare value: string;

  @BelongsTo(() => FoodPortionSizeMethod, 'portionSizeMethodId')
  declare portionSizeMethod?: NonAttribute<FoodPortionSizeMethod>;

  @BelongsTo(() => AsServedSet, {
    foreignKey: 'value',
    constraints: false,
  })
  declare asServedSet?: NonAttribute<AsServedSet>;

  @BelongsTo(() => GuideImage, {
    foreignKey: 'value',
    constraints: false,
  })
  declare guideImage?: NonAttribute<GuideImage>;

  @BelongsTo(() => StandardUnit, {
    foreignKey: 'value',
    constraints: false,
  })
  declare standardUnit?: NonAttribute<StandardUnit>;
}

export type FoodPortionSizeMethodParameterAttributes = Attributes<FoodPortionSizeMethodParameter>;
export type FoodPortionSizeMethodParameterCreationAttributes =
  CreationAttributes<FoodPortionSizeMethodParameter>;
