import type { FindOptions, WhereOptions } from 'sequelize';

import type { SurveySubmissionAttributes } from '../models/system';

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
        association: 'user',
        include: [
          { association: 'aliases', where, required: false },
          { association: 'customFields' },
        ],
      },
      { association: 'customFields' },
      {
        association: 'meals',
        include: [
          { association: 'customFields' },
          {
            association: 'foods',
            separate: true,
            include: [
              { association: 'customFields' },
              { association: 'fields' },
              {
                association: 'nutrients',
                separate: true,
                include: [{ association: 'nutrientType' }],
              },
              { association: 'portionSizes', separate: true },
            ],
          },
          { association: 'missingFoods', separate: true },
        ],
      },
    ],
    order: [
      ['submissionTime', 'ASC'],
      ['meals', 'hours', 'ASC'],
      ['meals', 'minutes', 'ASC'],
    ],
    ...ops,
  };
};
