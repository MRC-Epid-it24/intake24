import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import {
  SurveySubmissionAttributes,
  SurveySubmissionCreationAttributes,
} from '@common/types/models';
import { FindOptions, WhereOptions } from 'sequelize/types';
import BaseModel from '../model';
import {
  NutrientType,
  Survey,
  SurveySubmissionCustomField,
  SurveySubmissionField,
  SurveySubmissionMeal,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
  User,
} from '.';
import UserSurveyAlias from './user-survey-alias';
import UserCustomField from './user-custom-field';
import SurveySubmissionMealCustomField from './survey-submission-meal-custom-field';
import SurveySubmissionFood from './survey-submission-food';
import SurveySubmissionFoodCustomField from './survey-submission-food-custom-field';
import SurveySubmissionMissingFood from './survey-submission-missing-food';

export type SubmissionScope = {
  surveyId?: string | string[];
  userId?: string | string[];
};

export const submissionScope = ({
  surveyId,
  userId,
}: SubmissionScope): FindOptions<SurveySubmissionAttributes> => {
  const where: WhereOptions<SurveySubmissionAttributes> = {};

  if (surveyId) where.surveyId = surveyId;
  if (userId) where.userId = surveyId;

  return {
    where,
    include: [
      {
        model: User,
        include: [
          { model: UserSurveyAlias, where, required: false },
          { model: UserCustomField, separate: true },
        ],
      },
      { model: SurveySubmissionCustomField, separate: true },
      {
        model: SurveySubmissionMeal,
        separate: true,
        include: [
          { model: SurveySubmissionMealCustomField, separate: true },
          {
            model: SurveySubmissionFood,
            separate: true,
            include: [
              { model: SurveySubmissionFoodCustomField },
              { model: SurveySubmissionField, separate: true },
              {
                model: SurveySubmissionNutrient,
                separate: true,
                include: [{ model: NutrientType, required: true }],
              },
              { model: SurveySubmissionPortionSizeField, separate: true },
            ],
          },
          { model: SurveySubmissionMissingFood, separate: true },
        ],
      },
    ],
  };
};

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
  customFields: { include: [{ model: SurveySubmissionCustomField }] },
  meals: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmission',
  tableName: 'survey_submissions',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmission
  extends BaseModel<SurveySubmissionAttributes, SurveySubmissionCreationAttributes>
  implements SurveySubmissionAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public startTime!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public endTime!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public submissionTime!: Date;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public log!: string | null;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public uxSessionId!: string;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @HasMany(() => SurveySubmissionCustomField, 'surveySubmissionId')
  public customFields?: SurveySubmissionCustomField[];

  @HasMany(() => SurveySubmissionMeal, 'surveySubmissionId')
  public meals?: SurveySubmissionMeal[];
}
