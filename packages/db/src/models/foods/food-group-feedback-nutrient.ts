import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { FoodGroupFeedbackNutrientAttributes } from '@intake24/common/types/models/foods';
import BaseModel from '../model';
import { FoodGroupFeedback } from '.';

@Table({
  modelName: 'FoodGroupFeedbackNutrient',
  tableName: 'food_groups_feedback_nutrient_ids',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroupFeedbackNutrient
  extends BaseModel<FoodGroupFeedbackNutrientAttributes>
  implements FoodGroupFeedbackNutrientAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public foodGroupsFeedbackId!: number;

  @Column({
    primaryKey: true,
    // allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientId!: string;

  @BelongsTo(() => FoodGroupFeedback, 'foodGroupsFeedbackId')
  public foodGroupFeedback?: FoodGroupFeedback[];
}
