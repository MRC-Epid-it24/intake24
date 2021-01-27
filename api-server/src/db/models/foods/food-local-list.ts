import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { Locale } from '.';

@Table({
  modelName: 'FoodLocalList',
  tableName: 'foods_local_lists',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
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
}
