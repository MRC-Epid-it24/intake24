import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { sexes, weightTargets } from '@intake24/common/feedback';
import { PhysicalActivityLevel } from '@intake24/db';

export default validate(
  checkSchema({
    sex: {
      in: ['body'],
      errorMessage: 'Enter valid gender.',
      isIn: { options: [sexes] },
      optional: { options: { nullable: true } },
    },
    weightKg: {
      in: ['body'],
      errorMessage: 'Weight must be in 0-300 range.',
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
      optional: { options: { nullable: true } },
    },
    heightCm: {
      in: ['body'],
      errorMessage: 'Height must be in 0-300 range.',
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
      optional: { options: { nullable: true } },
    },
    birthdate: {
      in: ['body'],
      errorMessage: 'Birth date must be valid year.',
      isInt: true,
      toInt: true,
      optional: { options: { nullable: true } },
    },
    physicalActivityLevelId: {
      in: ['body'],
      errorMessage: 'Enter valid physical activity Level id.',
      isEmpty: { negated: true },
      optional: { options: { nullable: true } },
      custom: {
        options: async (value): Promise<void> => {
          const level = await PhysicalActivityLevel.findOne({ where: { id: value } });
          if (!level) throw new Error('Enter valid physical activity Level id.');
        },
      },
    },
    weightTarget: {
      in: ['body'],
      errorMessage: 'Enter valid weight target.',
      isEmpty: { negated: true },
      isIn: { options: [weightTargets] },
      optional: { options: { nullable: true } },
    },
  })
);
