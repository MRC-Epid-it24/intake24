import { Column, Table, BelongsTo, Scopes } from 'sequelize-typescript';
import { Food, Category } from '@api-server/db/models/foods';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'categories_categories',
})
export default class CategoryCategory extends BaseModel {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public subcategoryCode!: string;

  @Column({
    allowNull: false,
  })
  public categoryCode!: string;

  @BelongsTo(() => Category, 'subcategory_code')
  public subcategory?: Category;

  @BelongsTo(() => Category, 'category_code')
  public category?: Category;
}
