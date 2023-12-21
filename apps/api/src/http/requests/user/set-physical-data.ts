import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { sexes, weightTargets } from '@intake24/common/feedback';
import { PhysicalActivityLevel } from '@intake24/db';

const year = new Date().getFullYear();
const yearMin = year - 150;
const yearMax = year;

export default validate(
  checkSchema({
    survey: {
      in: ['query'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: true,
    },
    sex: {
      in: ['body'],
      errorMessage: typeErrorMessage('in.options', { options: sexes }),
      isIn: { options: [sexes] },
      optional: { options: { nullable: true } },
    },
    weightKg: {
      in: ['body'],
      errorMessage: typeErrorMessage('float.minMax', { min: 0, max: 300 }),
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
      optional: { options: { nullable: true } },
    },
    heightCm: {
      in: ['body'],
      errorMessage: typeErrorMessage('float.minMax', { min: 0, max: 300 }),
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
      optional: { options: { nullable: true } },
    },
    birthdate: {
      in: ['body'],
      errorMessage: typeErrorMessage('int.minMax', { min: yearMin, max: yearMax }),
      isInt: { options: { min: yearMin, max: yearMax } },
      toInt: true,
      optional: { options: { nullable: true } },
    },
    physicalActivityLevelId: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      optional: { options: { nullable: true } },
      custom: {
        options: async (value, meta): Promise<void> => {
          const level = await PhysicalActivityLevel.findByPk(value, { attributes: ['id'] });
          if (!level) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
    weightTarget: {
      in: ['body'],
      errorMessage: typeErrorMessage('in.options', { options: weightTargets }),
      isIn: { options: [weightTargets] },
      optional: { options: { nullable: true } },
    },
  })
);
