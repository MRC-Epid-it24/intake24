import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';

import { Category, Food } from '@intake24/db';

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
export default class FoodCategory extends BaseModel<
  InferAttributes<FoodCategory>,
  InferCreationAttributes<FoodCategory>
> {
  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodId: string;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare categoryId: string;

  @BelongsTo(() => Food, 'foodId')
  declare food?: NonAttribute<Food>;

  @BelongsTo(() => Category, 'categoryId')
  declare category?: NonAttribute<Category>;
}

export type FoodCategoryAttributes = Attributes<FoodCategory>;
export type FoodCategoryCreationAttributes = CreationAttributes<FoodCategory>;
