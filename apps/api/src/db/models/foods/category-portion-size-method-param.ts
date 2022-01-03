import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { CategoryPortionSizeMethod } from '@api/db';
import {
  PortionSizeMethodParameterAttributes,
  PortionSizeMethodParameterCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'CategoryPortionSizeMethodParameter',
  tableName: 'category_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethodParameter
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

  @BelongsTo(() => CategoryPortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: CategoryPortionSizeMethod;
}
