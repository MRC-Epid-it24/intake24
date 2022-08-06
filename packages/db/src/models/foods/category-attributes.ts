import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';

import type {
  CategoryAttributeAttributes,
  CategoryAttributeCreationAttributes,
  UseInRecipeType,
} from '@intake24/common/types/models';
import { Category } from '@intake24/db';

import BaseModel from '../model';

@Scopes(() => ({
  category: { include: [{ model: Category }] },
}))
@Table({
  modelName: 'CategoryAttribute',
  tableName: 'category_attributes',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryAttribute
  extends BaseModel<CategoryAttributeAttributes, CategoryAttributeCreationAttributes>
  implements CategoryAttributeAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  public sameAsBeforeOption!: boolean | null;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  public readyMealOption!: boolean | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public reasonableAmount!: number | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public useInRecipes!: UseInRecipeType | null;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;
}
