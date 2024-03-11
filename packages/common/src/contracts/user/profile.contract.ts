import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { strongPassword, userPhysicalDataScheme } from '../../schemas';

export const profile = initContract().router({
  updatePassword: {
    method: 'POST',
    path: '/user/password',
    body: strongPassword
      .extend({ passwordCurrent: z.string() })
      .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords don't match",
        path: ['passwordConfirm'],
      }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Update password',
    description: 'Update user password',
  },
  getPhysicalData: {
    method: 'GET',
    path: '/user/physical-data',
    query: z.object({
      survey: z.string().optional(),
    }),
    responses: {
      200: userPhysicalDataScheme.nullable(),
    },
    summary: 'Get physical data',
    description: 'Get user physical data for feedback and survey recall calculations.',
  },
  setPhysicalData: {
    method: 'POST',
    path: '/user/physical-data',
    query: z.object({
      survey: z.string().optional(),
    }),
    body: userPhysicalDataScheme.omit({ userId: true }),
    responses: {
      200: userPhysicalDataScheme,
    },
    summary: 'Set physical data',
    description: 'Set user physical data for feedback and survey recall calculations.',
  },
  submissions: {
    method: 'GET',
    path: '/user/submissions',
    query: z.object({
      survey: z.union([z.string(), z.array(z.string())]),
    }),
    responses: {
      // TODO: Add response schema
      200: z.object({}),
    },
    summary: 'User submissions',
    description: 'Get user submissions for selected surveys.',
  },
});
