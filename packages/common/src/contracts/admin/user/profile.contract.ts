import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const profile = initContract().router({
  profile: {
    method: 'GET',
    path: '/admin/user',
    responses: {
      200: z.object({
        profile: z.object({
          id: z.string(),
          name: z.string().nullable(),
          email: z.string(),
          phone: z.string().nullable(),
          verifiedAt: z.date().nullable(),
        }),
        permissions: z.array(z.string()),
        roles: z.array(z.string()),
      }),
    },
    summary: 'User profile data',
    description: 'Get logged-in user profile data',
  },
  verify: {
    method: 'POST',
    path: '/admin/user/verify',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Verify user email',
    description: 'Request email verification link to be sent to user email',
  },
});
