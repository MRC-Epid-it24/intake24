import { BelongsTo, Column, DataType, HasOne, Table } from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import Locale from '@/db/models/foods/locale';
import FoodLocal from '@/db/models/foods/food-local';

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

  @HasOne(() => FoodLocal, { sourceKey: 'foodCode', foreignKey: 'foodCode' })
  public foodLocal?: FoodLocal;
}
