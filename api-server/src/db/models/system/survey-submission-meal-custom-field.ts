import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionMealCustomField as SurveySubmissionMealCustomFieldAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmissionMeal } from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmissionMealCustomField',
  tableName: 'survey_submission_meal_custom_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMealCustomField
  extends BaseModel
  implements SurveySubmissionMealCustomFieldAttributes {
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
    type: DataType.STRING(64),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;
}
