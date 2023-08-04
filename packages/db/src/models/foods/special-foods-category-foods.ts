import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Category, Food } from '@intake24/db';

import BaseModel from '../model';
import SpecialFoodsSteps from './special-foods-steps';

@Scopes(() => ({
  list: {
    attributes: ['specialFoodsStepCode', 'categoryCode', 'foodCode'],
    order: [['specialFoodsCode', 'ASC']],
  },
}))
@Table({
  modelName: 'SpecialFoodsCategoryFoods',
  tableName: 'special_foods_category_foods',
  freezeTableName: true,
  underscored: true,
})
export default class SpecialFoodsCategoryFoods extends BaseModel<
  InferAttributes<SpecialFoodsCategoryFoods>,
  InferCreationAttributes<SpecialFoodsCategoryFoods>
> {
  @ForeignKey(() => SpecialFoodsSteps)
  @Column({
    allowNull: false,
    type: DataType.STRING(16),
    unique: false,
  })
  declare specialFoodsStepCode: string;

  @ForeignKey(() => Category)
  @Column({
    allowNull: true,
    type: DataType.STRING(16),
    unique: false,
  })
  declare categoryCode: string;

  @ForeignKey(() => Food)
  @Column({
    allowNull: true,
    type: DataType.STRING(16),
    unique: false,
  })
  declare foodCode: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare ownerId: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => SpecialFoodsSteps, 'specialFoodsStepCode')
  declare specialFoodsStep: SpecialFoodsSteps;

  @BelongsTo(() => Category, 'categoryCode')
  declare category?: Category;

  @BelongsTo(() => Food, 'foodCode')
  declare food?: Food;
}

export type SpecialFoodsCategoryFoodsAttributes = Attributes<SpecialFoodsCategoryFoods>;
export type SpecialFoodsCategoryFoodsCreationAttributes =
  CreationAttributes<SpecialFoodsCategoryFoods>;
