import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Scopes,
  Table,
} from 'sequelize-typescript';

import type { FoodAttributes } from '@intake24/common/types/models';

import BaseModel from '../model';
import {
  AssociatedFood,
  Brand,
  Category,
  FoodAttribute,
  FoodCategory,
  FoodGroup,
  FoodLocal,
  FoodLocalList,
} from '.';
import Locale from './locale';

@Scopes(() => ({
  attributes: { include: [{ model: FoodAttribute }] },
  locals: { include: [{ model: FoodLocal, as: 'locals' }] },
  brand: { include: [{ model: Brand }] },
}))
@Table({
  modelName: 'Food',
  tableName: 'foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Food extends BaseModel<FoodAttributes> implements FoodAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(8),
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodGroupId!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @HasOne(() => FoodAttribute, 'foodCode')
  public attributes?: FoodAttribute;

  @HasMany(() => AssociatedFood, 'foodCode')
  public associatedFoods?: AssociatedFood[];

  @HasMany(() => Brand, 'foodCode')
  public brands?: Brand[];

  @BelongsToMany(() => Category, () => FoodCategory)
  public parentCategories?: Category[];

  @BelongsToMany(() => Locale, () => FoodLocalList, 'foodCode', 'localeId')
  public locales?: Locale[];

  @HasMany(() => FoodCategory, 'foodCode')
  public parentCategoryMappings?: FoodCategory[];

  @HasMany(() => AssociatedFood, 'associatedFoodCode')
  public foodAssociations?: AssociatedFood[];

  @BelongsTo(() => FoodGroup, 'foodGroupId')
  public foodGroup?: FoodGroup;

  @HasMany(() => FoodLocal, 'foodCode')
  public locals?: FoodLocal[];

  @HasMany(() => FoodLocal, 'foodCode')
  public prototypeLocals?: FoodLocal[];
}
