import { Request } from 'express';
import { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions, Scheme } from '@intake24/db';
import slugify from 'slugify';
import { SchemeAttributes, SchemeTypes } from '@common/types/models';
import { validateMeals, validateRecallQuestions, validateExportSections } from '@common/validators';
import { unique, identifierSafeChars } from '@api/http/rules';

export const id: ParamSchema = {
  in: ['body'],
  errorMessage: 'Scheme ID must be unique string (charset [a-zA-Z0-9-_]).',
  isString: true,
  isEmpty: { negated: true },
  isWhitelisted: { options: identifierSafeChars },
  custom: {
    options: async (value): Promise<void> =>
      unique({
        model: Scheme,
        condition: { field: 'id', value: slugify(value, { strict: true }) },
      }),
  },
  customSanitizer: {
    options: (value) => (typeof value === 'string' ? slugify(value, { strict: true }) : value),
  },
};

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: 'Scheme name must be unique string.',
  isString: true,
  isEmpty: { negated: true },
  custom: {
    options: async (value, { req }): Promise<void> => {
      const { schemeId } = (req as Request).params;
      const where: WhereOptions<SchemeAttributes> = schemeId ? { id: { [Op.ne]: schemeId } } : {};

      return unique({ model: Scheme, condition: { field: 'name', value }, options: { where } });
    },
  },
};

export const defaults: Schema = {
  type: {
    in: ['body'],
    errorMessage: 'Enter valid scheme type.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        return Object.values(SchemeTypes).includes(value)
          ? Promise.resolve()
          : Promise.reject(new Error('Enter valid scheme type.'));
      },
    },
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
  export: {
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
