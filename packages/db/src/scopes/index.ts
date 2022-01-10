import { SurveySubmissionAttributes } from '@intake24/common/types/models';
import { FindOptions, WhereOptions } from 'sequelize';
import {
  User,
  UserCustomField,
  SurveySubmissionCustomField,
  SurveySubmissionField,
  SurveySubmissionFood,
  SurveySubmissionFoodCustomField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  SurveySubmissionMissingFood,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
  SystemNutrientType,
  UserSurveyAlias,
} from '../models/system';

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
  if (userId) where.userId = userId;

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
                include: [{ model: SystemNutrientType, required: true }],
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
