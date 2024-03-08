import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  foodSearchQuery,
  foodSearchResponse,
  recipeFoodResponse,
  userFoodData,
} from '../types/http';

export const food = initContract().router({
  search: {
    method: 'GET',
    path: '/foods/:localeId',
    query: foodSearchQuery,
    responses: {
      200: foodSearchResponse,
    },
    summary: 'Food search',
  },
  entry: {
    method: 'GET',
    path: '/foods/:localeId/:code',
    responses: {
      200: userFoodData,
    },
    summary: 'Food entry',
  },
  recipeFood: {
    method: 'GET',
    path: '/foods/:localeId/:code/recipe-food',
    responses: {
      200: recipeFoodResponse,
    },
    summary: 'Recipe food',
  },
  categories: {
    method: 'GET',
    path: '/foods/:localeId/:code/categories',
    responses: {
      200: z.array(z.string()),
    },
    summary: 'Food categories',
  },
});
