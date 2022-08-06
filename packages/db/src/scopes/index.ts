import type { FindOptions, WhereOptions } from 'sequelize';

import type { SurveySubmissionAttributes } from '@intake24/common/types/models';

import {
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
  User,
  UserCustomField,
  UserSurveyAlias,
} from '../models/system';

export type SubmissionScope = {
  surveyId?: string | string[];
  userId?: string | string[];
};

export const submissionScope = (
  scopeOps: SubmissionScope,
  ops: FindOptions<SurveySubmissionAttributes> = {}
): FindOptions<SurveySubmissionAttributes> => {
  const { surveyId, userId } = scopeOps;
  const where: WhereOptions<SurveySubmissionAttributes> = {};

  if (surveyId) where.surveyId = surveyId;
  if (userId) where.userId = userId;

  return {
    where,
    include: [
      {
        model: User,
        include: [{ model: UserSurveyAlias, where, required: false }, { model: UserCustomField }],
      },
      { model: SurveySubmissionCustomField },
      {
        model: SurveySubmissionMeal,
        include: [
          { model: SurveySubmissionMealCustomField },
          {
            model: SurveySubmissionFood,
            separate: true,
            include: [
              { model: SurveySubmissionFoodCustomField },
              { model: SurveySubmissionField },
              {
                model: SurveySubmissionNutrient,
                separate: true,
                include: [{ model: SystemNutrientType }],
              },
              { model: SurveySubmissionPortionSizeField, separate: true },
            ],
          },
          { model: SurveySubmissionMissingFood, separate: true },
        ],
      },
    ],
    ...ops,
  };
};
