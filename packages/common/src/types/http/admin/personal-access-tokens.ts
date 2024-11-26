import type { Pagination } from '../generic';

import { z } from 'zod';

export const personalAccessTokenAttributes = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().max(128),
  token: z.string().max(64),
  scopes: z.array(z.string()).nullable(),
  revoked: z.boolean(),
  usedAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PersonalAccessTokenAttributes = z.infer<typeof personalAccessTokenAttributes>;

export const personalAccessTokenResponse = personalAccessTokenAttributes.omit({ token: true });

export type PersonalAccessTokenResponse = z.infer<typeof personalAccessTokenResponse>;

export type PersonalAccessTokensResponse = Pagination<PersonalAccessTokenResponse>;
