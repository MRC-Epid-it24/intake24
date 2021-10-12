import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { Sex, WeightTarget } from '@common/types/models';
import { PhysicalActivityLevel } from '@api/db/models/foods';

export default validate(
  checkSchema({
    sex: {
      in: ['body'],
      errorMessage: 'Enter valid gender.',
      isIn: { options: [Object.values(Sex)] },
    },
    weightKg: {
      in: ['body'],
      errorMessage: 'Weight must be in 0-300 range.',
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
    },
    heightCm: {
      in: ['body'],
      errorMessage: 'Height must be in 0-300 range.',
      isFloat: { options: { min: 0, max: 300 } },
      toFloat: true,
    },
    birthdate: {
      in: ['body'],
      errorMessage: 'Birth date must be valid year.',
      isInt: true,
      toInt: true,
    },
    physicalActivityLevelId: {
      in: ['body'],
      errorMessage: 'Enter valid physical activity Level id.',
      isEmpty: { negated: true },
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
      isIn: { options: [Object.values(WeightTarget)] },
    },
  })
);
