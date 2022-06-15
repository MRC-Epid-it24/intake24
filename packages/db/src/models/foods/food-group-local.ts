import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import type {
  FoodGroupLocalAttributes,
  FoodGroupLocalCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { FoodGroup, FoodsLocale } from '.';

@Table({
  modelName: 'FoodGroupLocal',
  tableName: 'food_group_locals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroupLocal
  extends BaseModel<FoodGroupLocalAttributes, FoodGroupLocalCreationAttributes>
  implements FoodGroupLocalAttributes
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
  public foodGroupId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public name!: string;

  @BelongsTo(() => FoodGroup, 'foodGroupId')
  public group?: FoodGroup;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;
}
