import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { CategoryPortionSizeMethod } from '@api/db/models/foods';
import BaseModel from '../model';

@Table({
  modelName: 'CategoryPortionSizeMethodParameter',
  tableName: 'categories_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethodParameter extends BaseModel {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
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
  public categoryPortionSizeMethod?: CategoryPortionSizeMethod;
}
