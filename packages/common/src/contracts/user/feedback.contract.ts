import { initContract } from '@ts-rest/core';
import { Readable } from 'stream';
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
      200: z.instanceof(Readable),
    },
    summary: 'Download user feedback as PDF file',
  },
  email: {
    method: 'POST',
    path: '/user/feedback',
    query: z.object({
      survey: z.string(),
      submissions: z.array(z.string()).optional(),
    }),
    body: z
      .object({
        email: z.string().email().toLowerCase(),
        emailConfirm: z.string().email().toLowerCase(),
      })
      .refine((data) => data.email === data.emailConfirm, {
        path: ['emailConfirm'],
        message: 'Emails do not match',
      }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Email user feedback as PDF file attachment',
  },
});
