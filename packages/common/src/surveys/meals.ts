import { z } from 'zod';

import { requiredLocaleTranslation } from '../types';

export const meal = z.object({
  name: requiredLocaleTranslation,
  time: z.string(),
});

export type Meal = z.infer<typeof meal>;

export type Meals = Meal[];
