import { initContract } from '@ts-rest/core';

import { createSanitizer } from '../rules';
import { strongPassword } from '../schemas';
import { z } from '../util';

export const password = initContract().router({
  request: {
    method: 'POST',
    path: '/password',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      email: z.string().email().toLowerCase(),
      captcha: z
        .string()
        .optional()
        .openapi({ description: 'Captcha token if enabled on system level' }),
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Password request',
    description:
      'Request a password reset token to be sent by email. If captcha-protection activated, a captcha token has to be sent to validate the request.',
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
    summary: 'Password reset',
    description: 'Reset password using a token sent by email.',
  },
});
