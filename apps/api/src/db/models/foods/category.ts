/* eslint-disable no-use-before-define */
import { BelongsToMany, Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { CategoryAttributes, CategoryCreationAttributes } from '@common/types/models';
import {
  AssociatedFood,
  CategoryAttribute,
  CategoryCategory,
  CategoryLocal,
  Food,
  FoodCategory,
} from '.';
import BaseModel from '../model';

@Table({
  modelName: 'Category',
  tableName: 'categories',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Category
  extends BaseModel<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
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
    defaultValue: false,
  })
  public isHidden!: boolean;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @HasOne(() => CategoryAttribute)
  public attributes?: CategoryAttribute;

  @HasMany(() => AssociatedFood, 'associatedCategoryCode')
  public categoryAssociations?: AssociatedFood[];

  @BelongsToMany(() => Category, () => CategoryCategory, 'subcategoryCode', 'categoryCode')
  public parentCategories?: Category[];

  @HasMany(() => CategoryCategory, 'subcategoryCode')
  public parentCategoryMappings?: CategoryCategory[];

  @BelongsToMany(() => Category, () => CategoryCategory, 'categoryCode', 'subcategoryCode')
  public subCategories?: Category[];

  @HasMany(() => CategoryCategory, 'categoryCode')
  public subcategoryMappings?: CategoryCategory[];

  @BelongsToMany(() => Food, () => FoodCategory)
  public foods?: Food[];

  @HasMany(() => FoodCategory, 'categoryCode')
  public foodLinks?: CategoryCategory[];

  @HasMany(() => CategoryLocal, 'categoryCode')
  public locals?: CategoryLocal[];
}
