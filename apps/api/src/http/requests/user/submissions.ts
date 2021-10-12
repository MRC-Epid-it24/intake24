import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';

export default validate(
  checkSchema({
    surveyId: {
      in: ['query'],
      errorMessage: 'SurveyID must be string or array of strings.',
      custom: {
        options: async (value): Promise<void> => {
          if (typeof value !== 'string' && !Array.isArray(value))
            throw new Error('SurveyID must be string or array of strings.');

          if (Array.isArray(value) && value.some((item) => typeof item !== 'string'))
            throw new Error('SurveyID must be string or array of strings.');
        },
      },
    },
  })
);
