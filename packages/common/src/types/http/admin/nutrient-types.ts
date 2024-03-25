import { z } from 'zod';

import type { Pagination } from '@intake24/db/';

import { nutrientUnitAttributes } from './nutrient-units';

export const nutrientTypeAttributes = z.object({
  id: z.string(),
  unitId: z.string(),
  description: z.string(),
});

export type NutrientTypeAttributes = z.infer<typeof nutrientTypeAttributes>;

export const nutrientTypeResponse = nutrientTypeAttributes.extend({
  kcalPerUnit: z.number().optional(),
  unit: z
    .object({
      id: z.string(),
      description: z.string(),
    })
    .optional(),
});

export type NutrientTypeResponse = z.infer<typeof nutrientTypeResponse>;

export const nutrientTypeRequest = z.object({
  id: z.coerce.number().transform(String),
  unitId: z.string(),
  description: z.string().max(512),
  kcalPerUnit: z.coerce.number().nullish(),
});

export type NutrientTypeRequest = z.infer<typeof nutrientTypeRequest>;

export type NutrientTypesResponse = Pagination<NutrientTypeAttributes>;

export const nutrientTypeRefs = z.object({
  units: nutrientUnitAttributes.array(),
});

export type NutrientTypeRefs = z.infer<typeof nutrientTypeRefs>;
