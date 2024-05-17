import { Readable } from 'node:stream';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const feedback = initContract().router({
  download: {
    method: 'GET',
    path: '/user/feedback',
    query: z.object({
      survey: z.string(),
      submissions: z.array(z.string().uuid()).optional(),
    }),
    responses: {
      200: z.instanceof(Readable),
    },
    summary: 'Download feedback',
    description: 'Download feedback as PDF. Returns stream as application/pdf.',
  },
  email: {
    method: 'POST',
    path: '/user/feedback',
    query: z.object({
      survey: z.string(),
      submissions: z.array(z.string().uuid()).optional(),
    }),
    body: z
      .object({
        email: z.string().email().toLowerCase(),
        emailConfirm: z.string().email().toLowerCase(),
      })
      .refine(data => data.email === data.emailConfirm, {
        path: ['emailConfirm'],
        message: 'Emails do not match',
      }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Email feedback',
    description: 'Email user feedback as PDF file attachment',
  },
});
