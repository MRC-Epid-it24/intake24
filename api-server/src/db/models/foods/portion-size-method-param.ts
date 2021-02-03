import { BelongsTo, Column, Table } from 'sequelize-typescript';
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';
import BaseModel from '../model';

@Table({
  modelName: 'PortionSizeMethodParameter',
  tableName: 'food_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PortionSizeMethodParameter extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public portionSizeMethodId!: number;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => PortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: PortionSizeMethod;
}
