import { Request } from 'express';
import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { surveyMgmt } from '@/services/acl.service';

export default validate(
  checkSchema({
    userId: {
      in: ['params'],
      errorMessage: 'Please select an user.',
      isInt: true,
      toInt: true,
    },
    id: {
      in: ['body'],
      errorMessage: 'Please select an user.',
      isInt: true,
      toInt: true,
    },
    roles: {
      in: ['body'],
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { surveyId } = (req as Request).params;
          const allowedRoles = surveyMgmt(surveyId);

          if (
            !Array.isArray(value) ||
            value.some((item) => typeof item !== 'string' || !allowedRoles.includes(item))
          )
            throw new Error('Enter a valid list of roles.');

          Promise.resolve();
        },
      },
    },
  })
);
