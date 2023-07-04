import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { SurveySchemeAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { schemeTypes } from '@intake24/common/surveys';
import {
  // validateRecallQuestions,
  validateExportSections,
  validateMeals,
} from '@intake24/common/validators';
import { Op, SurveyScheme } from '@intake24/db';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: { bail: true },
  isEmpty: { negated: true, bail: true },
  custom: {
    options: async (value, meta): Promise<void> => {
      const { surveySchemeId } = (meta.req as Request).params;
      const where: WhereOptions<SurveySchemeAttributes> = surveySchemeId
        ? { id: { [Op.ne]: surveySchemeId } }
        : {};

      if (
        !(await unique({
          model: SurveyScheme,
          condition: { field: 'name', value },
          options: { where },
        }))
      )
        throw new Error(customTypeErrorMessage('unique._', meta));
    },
  },
};

export const defaults: Schema = {
  type: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
    isIn: {
      options: [schemeTypes],
      errorMessage: typeErrorMessage('in.options', { options: schemeTypes }),
    },
  },
  prompts: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      // TODO: tweak ajv JSON validator to work correctly with generic language object types & conditions
      /* try {
        validateRecallQuestions(value);
        return true;
      } catch (err) {
        throw new Error(err.message.split('\n')[0]);
      } */
      options: async (value): Promise<void> => {
        if (
          !isPlainObject(value) ||
          Object.values(value).some((item) => !Array.isArray(item) && !isPlainObject(item))
        )
          throw new Error();
      },
    },
  },
  meals: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value): boolean => {
        try {
          validateMeals(value);
          return true;
        } catch (err: any) {
          throw new Error(err.message.split('\n')[0]);
        }
      },
    },
  },
  dataExport: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value): boolean => {
        try {
          validateExportSections(value);
          return true;
        } catch (err: any) {
          throw new Error(err.message.split('\n')[0]);
        }
      },
    },
  },
};
