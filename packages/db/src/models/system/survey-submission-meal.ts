import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import type {
  SurveySubmissionMealAttributes,
  SurveySubmissionMealCreationAttributes,
} from '@intake24/common/types/models';
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
  extends BaseModel<SurveySubmissionMealAttributes, SurveySubmissionMealCreationAttributes>
  implements SurveySubmissionMealAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public surveySubmissionId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public hours!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public minutes!: number;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
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
