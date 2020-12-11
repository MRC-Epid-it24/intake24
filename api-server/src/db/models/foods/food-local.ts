import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';
import NutrientMapping from '@/db/models/foods/nutrient-mapping';
import BaseModel from '../model';
import { Food, FoodLocalList, Locale } from '.';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  locale: { include: [{ model: Locale }] },
  localeLists: { include: [{ model: FoodLocalList }] },
}))
@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_locals',
})
export default class FoodLocal extends BaseModel<FoodLocal> {
  @Column({
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
  })
  public localeId!: string;

  @Column
  public name!: string;

  @Column
  public simpleName!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsTo(() => Food, 'food_code')
  public food?: Food;

  @BelongsTo(() => Locale, 'locale_id')
  public locale?: Locale;

  @HasMany(() => PortionSizeMethod, 'food_local_id')
  public portionSizeMethods?: PortionSizeMethod[];

  @HasMany(() => NutrientMapping, 'food_local_id')
  public nutrientMappings?: NutrientMapping[];
}
