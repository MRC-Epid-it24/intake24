import { z } from 'zod';

import { localeTranslation } from '../../common';

export const associatedFood = z.object({
  foodCode: z.string().optional(),
  categoryCode: z.string().optional(),
  genericName: localeTranslation,
  promptText: localeTranslation,
  linkAsMain: z.boolean(),
  allowMultiple: z.boolean(),
});

export type AssociatedFood = z.infer<typeof associatedFood>;
