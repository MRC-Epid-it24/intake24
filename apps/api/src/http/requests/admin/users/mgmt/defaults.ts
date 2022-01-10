import { Request } from 'express';
import { Schema } from 'express-validator';
import ioc from '@intake24/api/ioc';

const defaults: Schema = {
  permissions: {
    in: ['body'],
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { surveyId } = (req as Request).params;

        const permissions = await ioc.cradle.adminSurveyService.getSurveyPermissions(
          surveyId,
          'list'
        );

        const allowedPermissions = permissions.map((permission) => permission.id);

        if (!Array.isArray(value) || value.some((item) => !allowedPermissions.includes(item)))
          throw new Error('Enter a valid list of survey management permissions.');
      },
    },
  },
};

export default defaults;
