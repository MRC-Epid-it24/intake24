import { Readable } from 'node:stream';

import { initContract } from '@ts-rest/core';
import { isLocale } from 'validator';
import { z } from 'zod';

const pdfFeedbackRequest = z.object({
  lang: z.string().refine(val => isLocale(val)).optional(),
  survey: z.string(),
  submissions: z.array(z.string().uuid()).optional(),
});

export const feedback = initContract().router({
  download: {
    method: 'GET',
    path: '/user/feedback',
    query: pdfFeedbackRequest,
    responses: {
      200: z.instanceof(Readable),
    },
    summary: 'Download feedback',
    description: 'Download feedback as PDF. Returns stream as application/pdf.',
  },
  email: {
    method: 'POST',
    path: '/user/feedback',
    body: pdfFeedbackRequest
      .extend({
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
