import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { createSanitizer } from '../rules';
import { strongPassword } from '../schemas';

export const password = initContract().router({
  request: {
    method: 'POST',
    path: '/password',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      email: z.string().email().toLowerCase(),
      captcha: z.string().optional(),
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Request a password reset',
  },
  reset: {
    method: 'POST',
    path: '/password/reset',
    body: strongPassword
      .extend({ email: z.string().email().toLowerCase(), token: z.string() })
      .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords don't match",
        path: ['passwordConfirm'],
      }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Reset a password',
  },
});
