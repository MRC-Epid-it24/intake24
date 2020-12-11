import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_portion_size_method_params',
})
export default class PortionSizeMethodParameter extends BaseModel<PortionSizeMethodParameter> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column
  public name!: string;

  @Column
  public value!: string;

  @BelongsTo(() => PortionSizeMethod, 'portion_size_method_id')
  public portionSizeMethod?: PortionSizeMethod;
}
