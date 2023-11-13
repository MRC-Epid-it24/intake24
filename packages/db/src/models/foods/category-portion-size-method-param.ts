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

import {
  AsServedSet,
  CategoryPortionSizeMethod,
  DrinkwareSet,
  GuideImage,
  ImageMap,
  StandardUnit,
} from '@intake24/db';

import BaseModel from '../model';

@Table({
  modelName: 'CategoryPortionSizeMethodParameter',
  tableName: 'category_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethodParameter extends BaseModel<
  InferAttributes<CategoryPortionSizeMethodParameter>,
  InferCreationAttributes<CategoryPortionSizeMethodParameter>
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
  declare portionSizeMethodId: ForeignKey<CategoryPortionSizeMethod['id']>;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  declare value: string;

  @BelongsTo(() => CategoryPortionSizeMethod, 'portionSizeMethodId')
  declare portionSizeMethod?: NonAttribute<CategoryPortionSizeMethod>;

  @BelongsTo(() => AsServedSet, {
    foreignKey: 'value',
    constraints: false,
  })
  declare asServedSet?: NonAttribute<AsServedSet>;

  @BelongsTo(() => DrinkwareSet, {
    foreignKey: 'value',
    constraints: false,
  })
  declare drinkwareSet?: NonAttribute<DrinkwareSet>;

  @BelongsTo(() => GuideImage, {
    foreignKey: 'value',
    constraints: false,
  })
  declare guideImage?: NonAttribute<GuideImage>;

  @BelongsTo(() => ImageMap, {
    foreignKey: 'value',
    constraints: false,
  })
  declare imageMap?: NonAttribute<ImageMap>;

  @BelongsTo(() => StandardUnit, {
    foreignKey: 'value',
    constraints: false,
  })
  declare standardUnit?: NonAttribute<StandardUnit>;
}

export type CategoryPortionSizeMethodParameterAttributes =
  Attributes<CategoryPortionSizeMethodParameter>;
export type CategoryPortionSizeMethodParameterCreationAttributes =
  CreationAttributes<CategoryPortionSizeMethodParameter>;
