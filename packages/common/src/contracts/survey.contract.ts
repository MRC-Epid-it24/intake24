import { initContract } from '@ts-rest/core';
import { isJWT } from 'validator';
import { z } from 'zod';

import { createUserResponse, generateUserResponse, publicSurveyEntry } from '../types/http';

export const survey = initContract().router({
  browse: {
    method: 'GET',
    path: '/surveys',
    responses: {
      200: publicSurveyEntry.array(),
    },
    summary: 'Browse public surveys',
  },
  entry: {
    method: 'GET',
    path: '/surveys/:slug',
    query: z.object({
      survey: z.string().optional(),
    }),
    responses: {
      200: publicSurveyEntry,
    },
    summary: 'Get survey entry',
  },
  generateUser: {
    method: 'POST',
    path: '/surveys/:slug/generate-user',
    body: z.object({
      captcha: z.string().optional(),
    }),
    responses: {
      200: generateUserResponse,
    },
    summary: 'Generate user for survey public survey',
  },
  createUser: {
    method: 'POST',
    path: '/surveys/:slug/create-user',
    body: z.object({
      token: z.string().refine((value) => isJWT(value)),
    }),
    responses: {
      200: createUserResponse,
    },
    summary: 'Create user for survey survey using JWT encoded parameters',
  },
});
