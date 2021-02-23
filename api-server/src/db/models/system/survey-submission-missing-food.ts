import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionMissingFood as SurveySubmissionMissingFoodAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmissionMeal } from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmissionMissingFood',
  tableName: 'survey_submission_missing_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMissingFood
  extends BaseModel
  implements SurveySubmissionMissingFoodAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public mealId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public brand!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public portionSize!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public leftovers!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;
}
