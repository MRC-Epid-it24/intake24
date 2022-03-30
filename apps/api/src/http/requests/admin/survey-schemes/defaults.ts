import type { Request } from 'express';
import { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions, SurveyScheme } from '@intake24/db';
import { SurveySchemeAttributes } from '@intake24/common/types/models';
import {
  validateMeals,
  // validateRecallQuestions,
  validateExportSections,
} from '@intake24/common/validators';
import { unique } from '@intake24/api/http/rules';
import { schemeTypes } from '@intake24/common/schemes';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: 'Survey scheme name must be unique.',
  isString: true,
  isEmpty: { negated: true },
  custom: {
    options: async (value, { req }): Promise<void> => {
      const { surveySchemeId } = (req as Request).params;
      const where: WhereOptions<SurveySchemeAttributes> = surveySchemeId
        ? { id: { [Op.ne]: surveySchemeId } }
        : {};

      return unique({
        model: SurveyScheme,
        condition: { field: 'name', value },
        options: { where },
      });
    },
  },
};

export const defaults: Schema = {
  type: {
    in: ['body'],
    errorMessage: 'Enter valid scheme type.',
    isString: true,
    isEmpty: { negated: true },
    isIn: { options: [schemeTypes] },
  },
  questions: {
    in: ['body'],
    errorMessage: 'Enter valid scheme questions.',
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
          throw new Error('Enter valid scheme questions.');
      },
    },
  },
  meals: {
    in: ['body'],
    errorMessage: 'Enter valid meal list.',
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
    errorMessage: 'Enter valid data export field list.',
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
