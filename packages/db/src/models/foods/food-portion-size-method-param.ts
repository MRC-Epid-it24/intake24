import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type {
  PortionSizeMethodParameterAttributes,
  PortionSizeMethodParameterCreationAttributes,
} from '@intake24/common/types/models/foods';

import BaseModel from '../model';
import { AsServedSet, FoodPortionSizeMethod, GuideImage, StandardUnit } from '.';

@Table({
  modelName: 'FoodPortionSizeMethodParameter',
  tableName: 'food_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodPortionSizeMethodParameter
  extends BaseModel<
    PortionSizeMethodParameterAttributes,
    PortionSizeMethodParameterCreationAttributes
  >
  implements PortionSizeMethodParameterAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public portionSizeMethodId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public value!: string;

  @BelongsTo(() => FoodPortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: FoodPortionSizeMethod;

  @BelongsTo(() => AsServedSet, {
    foreignKey: 'value',
    constraints: false,
  })
  public asServedSet?: AsServedSet;

  @BelongsTo(() => GuideImage, {
    foreignKey: 'value',
    constraints: false,
  })
  public guideImage?: GuideImage;

  @BelongsTo(() => StandardUnit, {
    foreignKey: 'value',
    constraints: false,
  })
  public standardUnit?: StandardUnit;
}
