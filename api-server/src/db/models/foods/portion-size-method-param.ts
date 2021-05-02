import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';
import {
  PortionSizeMethodParameterAttributes,
  PortionSizeMethodParameterCreationAttributes,
} from '@common/types/models/foods';
import BaseModel from '../model';

@Table({
  modelName: 'PortionSizeMethodParameter',
  tableName: 'food_portion_size_method_params',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PortionSizeMethodParameter
  extends BaseModel<
    PortionSizeMethodParameterAttributes,
    PortionSizeMethodParameterCreationAttributes
  >
  implements PortionSizeMethodParameterAttributes {
  @Column({
    allowNull: false,
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

  @BelongsTo(() => PortionSizeMethod, 'portionSizeMethodId')
  public portionSizeMethod?: PortionSizeMethod;
}
