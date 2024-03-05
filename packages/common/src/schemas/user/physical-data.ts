import { z } from 'zod';

import { sexes, weightTargets } from '@intake24/common/feedback';

const year = new Date().getFullYear();
const yearMin = year - 150;
const yearMax = year;

export const userPhysicalDataScheme = z.object({
  userId: z.string(),
  sex: z.enum(sexes).nullable(),
  weightKg: z.number().min(0).max(300).nullable(),
  heightCm: z.number().min(0).max(300).nullable(),
  birthdate: z.number().min(yearMin).max(yearMax).nullable(),
  physicalActivityLevelId: z.string().nullable(),
  weightTarget: z.enum(weightTargets).nullable(),
});

export type UserPhysicalDataScheme = z.infer<typeof userPhysicalDataScheme>;
