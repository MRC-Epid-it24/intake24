import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { CategoryPortionSizeMethod } from '@api/db/models/foods';
import {
  CategoryPortionSizeMethodParameterAttributes,
  CategoryPortionSizeMethodParameterCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'CategoryPortionSizeMethodParameter',
  tableName: 'categories_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethodParameter
  extends BaseModel<
    CategoryPortionSizeMethodParameterAttributes,
    CategoryPortionSizeMethodParameterCreationAttributes
  >
  implements CategoryPortionSizeMethodParameterAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public portionSizeMethodId!: number;

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

  @BelongsTo(() => CategoryPortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: CategoryPortionSizeMethod;
}
