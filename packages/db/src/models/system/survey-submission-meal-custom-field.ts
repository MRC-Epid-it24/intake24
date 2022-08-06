import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import type {
  SurveySubmissionMealCustomFieldAttributes,
  SurveySubmissionMealCustomFieldCreationAttributes,
} from '@intake24/common/types/models';

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
  extends BaseModel<
    SurveySubmissionMealCustomFieldAttributes,
    SurveySubmissionMealCustomFieldCreationAttributes
  >
  implements SurveySubmissionMealCustomFieldAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public mealId!: string;

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
