import { initContract } from '@ts-rest/core';

import { createSanitizer } from '../rules';
import { z } from '../util';

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
      captcha: z
        .string()
        .optional()
        .openapi({ description: 'Captcha token if enabled on system and survey level' }),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'Email & password login',
    description: 'Survey participant login with email and password.',
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
      captcha: z
        .string()
        .optional()
        .openapi({ description: 'Captcha token if enabled on system and survey level' }),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'Alias & password login',
    description: 'Survey participant login with alias and password.',
  },
  tokenLogin: {
    method: 'POST',
    path: '/auth/login/token',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    body: z.object({
      token: z.string(),
      captcha: z
        .string()
        .optional()
        .openapi({ description: 'Captcha token if enabled on system and survey level' }),
    }),
    responses: {
      200: loginResponse,
    },
    summary: 'URL Token login',
    description: 'Survey participant login with unique URL token.',
  },
  refresh: {
    method: 'POST',
    path: '/auth/refresh',
    body: null,
    responses: {
      200: z.object({ accessToken: z.string() }),
    },
    summary: 'Refresh access token',
    description:
      'Refresh access token using refresh token. API server expects refresh token sent as cookie. Cookie name can differ based on API server configuration.',
  },
  logout: {
    method: 'POST',
    path: '/auth/logout',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Logout from survey',
    description: 'Clears cookie which stores refresh token and revokes refresh token.',
  },
});
