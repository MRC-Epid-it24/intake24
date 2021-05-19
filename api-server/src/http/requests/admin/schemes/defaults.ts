import { Request } from 'express';
import { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions } from 'sequelize';
import { Scheme } from '@/db/models/system';
import { unique } from '@/http/rules';
import { SchemeTypes } from '@common/types/models';
import { validateMeals, validateRecallQuestions, validateExportSections } from '@common/validators';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Scheme name must be unique string.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { schemeId } = (req as Request).params;
        const except: WhereOptions = schemeId ? { id: { [Op.ne]: schemeId } } : {};

        return unique({ model: Scheme, condition: { field: 'name', value }, except });
      },
    },
  },
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

        Promise.resolve();
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
        } catch (err) {
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
        } catch (err) {
          throw new Error(err.message.split('\n')[0]);
        }
      },
    },
  },
};

export default defaults;
