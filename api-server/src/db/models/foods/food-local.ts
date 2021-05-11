import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { FoodLocalAttributes, FoodLocalCreationAttributes } from '@common/types/models';
import NutrientMapping from '@api-server/db/models/foods/nutrient-mapping';
import { Food, FoodLocalList, Locale, PortionSizeMethod } from '@api-server/db/models/foods';
import BaseModel from '../model';

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
export default class FoodLocal
  extends BaseModel<FoodLocalAttributes, FoodLocalCreationAttributes>
  implements FoodLocalAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
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
