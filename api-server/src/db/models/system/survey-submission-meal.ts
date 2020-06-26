import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import SurveySubmission from './survey-submission';
import SurveySubmissionFood from './survey-submission-food';
import SurveySubmissionMealCustomField from './survey-submission-food-custom-field';
import SurveySubmissionMissingFood from './survey-submission-missing-food';

@Scopes(() => ({
  submission: { include: [{ model: SurveySubmission }] },
  customFields: { include: [{ model: SurveySubmissionMealCustomField }] },
  foods: { include: [{ model: SurveySubmissionFood }] },
  misingFoods: { include: [{ model: SurveySubmissionMissingFood }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMeal extends BaseModel<SurveySubmissionMeal> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public surveySubmissionId!: string;

  @Column({
    allowNull: false,
  })
  public hours!: number;

  @Column({
    allowNull: false,
  })
  public minutes!: number;

  @Column
  public name!: string;

  @BelongsTo(() => SurveySubmission, 'surveySubmissionId')
  public submission?: SurveySubmission;

  @HasMany(() => SurveySubmissionMealCustomField, 'mealId')
  public customFields?: SurveySubmissionMealCustomField[];

  @HasMany(() => SurveySubmissionFood, 'mealId')
  public foods?: SurveySubmissionFood[];

  @HasMany(() => SurveySubmissionMissingFood, 'mealId')
  public misingFoods?: SurveySubmissionMissingFood[];
}
