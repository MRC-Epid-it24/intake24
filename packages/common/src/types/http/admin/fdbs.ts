import { z } from 'zod';

import { nutrientTableAttributes } from './nutrient-tables';

export const foodDatabaseRefs = z.object({
  nutrientTables: nutrientTableAttributes.array(),
});

export type FoodDatabaseRefs = z.infer<typeof foodDatabaseRefs>;
