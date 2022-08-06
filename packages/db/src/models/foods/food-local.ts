import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';

import type {
  FoodLocalAttributes,
  FoodLocalCreationAttributes,
} from '@intake24/common/types/models';
import {
  Food,
  FoodLocalList,
  FoodNutrient,
  FoodPortionSizeMethod,
  FoodsLocale,
} from '@intake24/db';

import BaseModel from '../model';
import NutrientTableRecord from './nutrient-table-record';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  locale: { include: [{ model: FoodsLocale }] },
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
  public main?: Food;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;

  @HasMany(() => FoodPortionSizeMethod, 'foodLocalId')
  public portionSizeMethods?: FoodPortionSizeMethod[];

  @BelongsToMany(() => NutrientTableRecord, () => FoodNutrient)
  public nutrientRecords?: NutrientTableRecord[];

  @HasMany(() => FoodNutrient, 'foodLocalId')
  public nutrientMappings?: FoodNutrient[];
}
