import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const feedback = initContract().router({
  download: {
    method: 'GET',
    path: '/user/feedback',
    query: z.object({
      survey: z.string(),
      submissions: z.array(z.string()).optional(),
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Download user feedback as PDF',
  },
  email: {
    method: 'POST',
    path: '/user/feedback',
    query: z.object({
      survey: z.string(),
      submissions: z.array(z.string()).optional(),
    }),
    body: z.object({
      email: z.string().email(),
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Email user feedback as PDF attachment',
  },
});
