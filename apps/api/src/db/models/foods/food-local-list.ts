import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { FoodLocalListAttributes } from '@common/types/models';
import BaseModel from '../model';
import { Locale } from '.';

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

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;
}
