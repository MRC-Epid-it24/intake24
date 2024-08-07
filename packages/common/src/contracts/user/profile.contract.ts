import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { userPhysicalDataAttributes, userPhysicalDataResponse } from '@intake24/common/types/http';

import { strongPasswordWithConfirm } from '../../security';

export const profile = initContract().router({
  updatePassword: {
    method: 'POST',
    path: '/user/password',
    body: strongPasswordWithConfirm
      .extend({ passwordCurrent: z.string() })
      .refine(data => data.password === data.passwordConfirm, {
        message: 'Passwords don\'t match',
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
      200: userPhysicalDataResponse,
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
    body: userPhysicalDataAttributes.omit({ userId: true }),
    responses: {
      200: userPhysicalDataResponse,
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
