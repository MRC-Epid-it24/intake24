import { Column, Table, BelongsTo, Scopes } from 'sequelize-typescript';
import { Food, Category } from '@api-server/db/models/foods';
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
export default class FoodCategory extends BaseModel {
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
  public categoryCode!: string;

  @BelongsTo(() => Food, 'food_code')
  public food?: Food;

  @BelongsTo(() => Category, 'category_code')
  public category?: Category;
}
