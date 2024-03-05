import { initContract } from '@ts-rest/core';

import { categoryContents, categorySearch, paginationRequest } from '../types/http';

export const category = initContract().router({
  rootContents: {
    method: 'GET',
    path: '/categories/:localeId',
    responses: {
      200: categoryContents,
    },
    summary: 'Root category contents',
  },
  contents: {
    method: 'GET',
    path: '/categories/:localeId/:code',
    responses: {
      200: categoryContents,
    },
    summary: 'Category contents',
  },
  browse: {
    method: 'GET',
    path: '/categories/:localeId/:code/:search',
    query: paginationRequest,
    responses: {
      200: categorySearch,
    },
    summary: 'Browse category contents',
  },
});
