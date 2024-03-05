import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { createSanitizer } from '../rules';

const loginResponse = z.union([
  z.object({ accessToken: z.string() }),
  z.object({ surveyId: z.string(), provider: z.literal('captcha') }),
]);

export const authentication = initContract().router({
  emailLogin: {
    method: 'POST',
    path: '/auth/login',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      email: z.string().toLowerCase(),
      password: z.string(),
      survey: z.string(),
      captcha: z.string().optional(),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'Survey login with email and password',
  },
  aliasLogin: {
    method: 'POST',
    path: '/auth/login/alias',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      username: z.string(),
      password: z.string(),
      survey: z.string(),
      captcha: z.string().optional(),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'Survey login with alias and password',
  },
  tokenLogin: {
    method: 'POST',
    path: '/auth/login/token',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      token: z.string(),
      captcha: z.string().optional(),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'Survey login with token',
  },
  refresh: {
    method: 'POST',
    path: '/auth/refresh',
    body: null,
    responses: {
      200: z.object({ accessToken: z.string() }),
    },
    summary: 'Refresh survey token',
  },
  logout: {
    method: 'POST',
    path: '/auth/logout',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Logout from survey',
  },
});
