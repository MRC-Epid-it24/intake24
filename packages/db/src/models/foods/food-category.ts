import { Column, DataType, ForeignKey, Table, BelongsTo, Scopes } from 'sequelize-typescript';
import type { FoodCategoryAttributes } from '@intake24/common/types/models';
import { Food, Category } from '@intake24/db';
import BaseModel from '../model';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  category: { include: [{ model: Category }] },
}))
@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'foods_categories',
})
export default class FoodCategory
  extends BaseModel<FoodCategoryAttributes>
  implements FoodCategoryAttributes
{
  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;
}
