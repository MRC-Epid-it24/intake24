import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  recipeFoodAttributes,
  recipeFoodRequest,
  recipeFoodStepAttributes,
  recipeFoodStepRequest,
} from '@intake24/common/types/http/admin';

export const recipeFood = initContract().router({
  get: {
    method: 'GET',
    path: '/admin/locales/:localeId/recipe-foods',
    responses: {
      200: recipeFoodAttributes.array(),
    },
    summary: 'Browse locale recipe foods',
    description: 'Browse locale recipe foods (paginated list)',
  },
  set: {
    method: 'POST',
    path: '/admin/locales/:localeId/recipe-foods',
    body: recipeFoodRequest.array(),
    responses: {
      200: recipeFoodAttributes.array(),
    },
    summary: 'Set locale recipe foods',
    description: 'Set locale recipe foods',
  },
  getSteps: {
    method: 'GET',
    path: '/admin/locales/:localeId/recipe-foods/:recipeFoodId/steps',
    responses: {
      200: recipeFoodStepAttributes.array(),
    },
    summary: 'Browse locale recipe food steps',
    description: 'Browse locale recipe food steps',
  },
  setSteps: {
    method: 'POST',
    path: '/admin/locales/:localeId/recipe-foods/:recipeFoodId/steps',
    body: z.object({
      items: recipeFoodStepRequest.array(),
    }),
    responses: {
      200: recipeFoodStepAttributes.array(),
    },
    summary: 'Set locale recipe food steps',
    description: 'Set locale recipe food steps',
  },
});
