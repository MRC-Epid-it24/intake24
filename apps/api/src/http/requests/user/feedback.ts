import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    surveyId: {
      in: ['query'],
      errorMessage: 'SurveyID must be a string',
      isString: true,
    },
  })
);
