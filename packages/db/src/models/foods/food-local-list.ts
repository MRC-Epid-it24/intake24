import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type { FoodLocalListAttributes } from '@intake24/common/types/models';

import BaseModel from '../model';
import { FoodsLocale } from '.';

@Table({
  modelName: 'FoodLocalList',
  tableName: 'foods_local_lists',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodLocalList
  extends BaseModel<FoodLocalListAttributes>
  implements FoodLocalListAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;
}
