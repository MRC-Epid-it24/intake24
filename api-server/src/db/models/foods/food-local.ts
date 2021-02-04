import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import NutrientMapping from '@api-server/db/models/foods/nutrient-mapping';
import BaseModel from '../model';
import { Food, FoodLocalList, Locale, PortionSizeMethod } from '@api-server/db/models/foods';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  locale: { include: [{ model: Locale }] },
  localeLists: { include: [{ model: FoodLocalList }] },
}))
@Table({
  modelName: 'FoodLocal',
  tableName: 'food_locals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodLocal extends BaseModel<FoodLocal> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
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

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public name!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public simpleName!: string | null;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @HasMany(() => PortionSizeMethod, 'foodLocalId')
  public portionSizeMethods?: PortionSizeMethod[];

  @HasMany(() => NutrientMapping, 'foodLocalId')
  public nutrientMappings?: NutrientMapping[];
}
