import { z } from 'zod';

import { requiredLocaleTranslation } from '.';

export const meal = z.object({
  name: requiredLocaleTranslation,
  time: z.string(),
});

export type Meal = z.infer<typeof meal>;

export type Meals = Meal[];
