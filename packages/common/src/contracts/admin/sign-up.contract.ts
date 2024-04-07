import { initContract } from '@ts-rest/core';
import { isJWT } from 'validator';
import { z } from 'zod';

import { strongPasswordWithConfirm } from '@intake24/common/schemas';
import { loginResponse } from '@intake24/common/types/http';

import { createSanitizer } from '../../rules';

export const signUp = initContract().router({
  signUp: {
    method: 'POST',
    path: '/admin/sign-up',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: strongPasswordWithConfirm
      .extend({
        email: z.string().email().toLowerCase(),
        emailConfirm: z.string().email().toLowerCase(),
        name: z.string().min(3).max(512),
        phone: z.string().max(32).nullish(),
        terms: z.boolean().refine(value => value === true),
        captcha: z
          .string()
          .nullish()
          .openapi({ description: 'Captcha token if enabled on system and survey level' }),
      })
      .superRefine((data, ctx) => {
        if (data.email !== data.emailConfirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['emailConfirm'],
            message: `Emails do not match`,
          });
        }

        if (data.email !== data.emailConfirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['passwordConfirm'],
            message: `Passwords do not match`,
          });
        }
      }),
    responses: {
      200: z.union([loginResponse, z.any()]),
    },
    summary: 'Admin sign-up',
    description: 'Register account for admin interface',
  },
  verify: {
    method: 'POST',
    path: '/admin/sign-up/verify',
    body: z.object({
      token: z.string().refine(value => isJWT(value)),
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Admin email verification',
    description: 'Verify email address for admin account',
  },
});
