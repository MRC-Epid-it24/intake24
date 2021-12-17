import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { FoodLocalAttributes, FoodLocalCreationAttributes } from '@common/types/models';
import NutrientMapping from '@api/db/models/foods/nutrient-mapping';
import { Food, FoodLocalList, Locale, FoodPortionSizeMethod } from '@api/db/models/foods';
import BaseModel from '../model';
import NutrientTableRecord from './nutrient-table-record';

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
  public id!: string;

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

  @HasMany(() => FoodPortionSizeMethod, 'foodLocalId')
  public portionSizeMethods?: FoodPortionSizeMethod[];

  @HasMany(() => NutrientMapping, 'foodLocalId')
  public nutrientMappings?: NutrientMapping[];

  @BelongsToMany(() => NutrientTableRecord, () => NutrientMapping)
  public nutrients?: NutrientTableRecord[];
}
