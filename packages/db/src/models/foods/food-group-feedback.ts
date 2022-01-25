import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  FoodGroupFeedbackAttributes,
  FoodGroupFeedbackCreationAttributes,
} from '@intake24/common/types/models/foods';
import BaseModel from '../model';
import { FoodGroupFeedbackNutrient } from '.';

@Table({
  modelName: 'FoodGroupFeedback',
  tableName: 'food_groups_feedback',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroupFeedback
  extends BaseModel<FoodGroupFeedbackAttributes, FoodGroupFeedbackCreationAttributes>
  implements FoodGroupFeedbackAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public tooHighThreshold!: number | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public tooHighMessage!: string | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public tooLowThreshold!: number | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public tooLowMessage!: string | null;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  public tellMeMoreText!: string;

  @HasMany(() => FoodGroupFeedbackNutrient, 'foodGroupsFeedbackId')
  public nutrients?: FoodGroupFeedbackNutrient[];
}
