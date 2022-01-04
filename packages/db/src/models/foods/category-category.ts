import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { CategoryCategoryAttributes } from '@common/types/models';
import { Category } from '@intake24/db';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'categories_categories',
})
export default class CategoryCategory
  extends BaseModel<CategoryCategoryAttributes>
  implements CategoryCategoryAttributes
{
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public subcategoryCode!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @BelongsTo(() => Category, 'subcategoryCode')
  public subcategory?: Category;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;
}
