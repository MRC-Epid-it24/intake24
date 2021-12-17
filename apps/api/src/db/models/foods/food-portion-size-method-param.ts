import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import PortionSizeMethod from '@api/db/models/foods/food-portion-size-method';
import {
  PortionSizeMethodParameterAttributes,
  PortionSizeMethodParameterCreationAttributes,
} from '@common/types/models/foods';
import BaseModel from '../model';

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

  @BelongsTo(() => PortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: PortionSizeMethod;
}
