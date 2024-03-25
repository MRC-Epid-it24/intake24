import { z } from 'zod';

export const signInLogAttributes = z.object({
  date: z.date(),
  id: z.string(),
  message: z.string().nullable(),
  provider: z.string(),
  providerKey: z.string(),
  remoteAddress: z.string().nullable(),
  successful: z.boolean(),
  userAgent: z.string().nullable(),
  userId: z.string().nullable(),
});

export type SignInLogAttributes = z.infer<typeof signInLogAttributes>;
