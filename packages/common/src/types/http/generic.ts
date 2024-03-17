import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const jsonObjectSchema: z.ZodType<Json> = z.lazy(() => z.record(jsonSchema));

export const paginationRequest = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  sort: z.union([z.literal('asc'), z.literal('desc')]).optional(),
  search: z.string().max(128).optional(),
});

export const paginationMeta = z.object({
  from: z.number(),
  lastPage: z.number(),
  page: z.number(),
  path: z.string(),
  limit: z.number(),
  to: z.number(),
  total: z.number(),
});
