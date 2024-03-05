import { z } from 'zod';

import { range, sexes } from './shared';

export const henryCoefficient = z.object({
  id: z.string(),
  sex: z.enum(sexes),
  age: range,
  weightCoefficient: z.number(),
  heightCoefficient: z.number(),
  constant: z.number(),
});

export type HenryCoefficient = z.infer<typeof henryCoefficient>;

// Type for validator
export type HenryCoefficients = HenryCoefficient[];
