import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionMeal as SurveySubmissionMealAttributes } from '@common/types/models';
import BaseModel from '../model';
import {
  SurveySubmission,
  SurveySubmissionFood,
  SurveySubmissionMealCustomField,
  SurveySubmissionMissingFood,
} from '.';

@Scopes(() => ({
  submission: { include: [{ model: SurveySubmission }] },
  customFields: { include: [{ model: SurveySubmissionMealCustomField }] },
  foods: { include: [{ model: SurveySubmissionFood }] },
  missingFoods: { include: [{ model: SurveySubmissionMissingFood }] },
}))
@Table({
  modelName: 'SurveySubmissionMeal',
  tableName: 'survey_submission_meals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMeal
  extends BaseModel
  implements SurveySubmissionMealAttributes {
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

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public name!: string | null;

  @BelongsTo(() => SurveySubmission, 'surveySubmissionId')
  public submission?: SurveySubmission;

  @HasMany(() => SurveySubmissionMealCustomField, 'mealId')
  public customFields?: SurveySubmissionMealCustomField[];

  @HasMany(() => SurveySubmissionFood, 'mealId')
  public foods?: SurveySubmissionFood[];

  @HasMany(() => SurveySubmissionMissingFood, 'mealId')
  public missingFoods?: SurveySubmissionMissingFood[];
}
