import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import { FoodLocal, Locale } from '@/db/models/foods';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'foods_local_lists',
})
export default class FoodLocalList extends BaseModel<FoodLocalList> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public localeId!: string;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @BelongsTo(() => FoodLocal, 'foodCode')
  public foodLocal?: FoodLocal;
}
