import { initContract } from '@ts-rest/core';

import {
  splitWordAttributes,
  splitWordRequest,
} from '@intake24/common/types/http/admin';

export const splitWord = initContract().router({
  get: {
    method: 'GET',
    path: '/admin/locales/:localeId/split-words',
    responses: {
      200: splitWordAttributes.array(),
    },
    summary: 'Browse locale split words',
    description: 'Browse locale split words',
  },
  set: {
    method: 'POST',
    path: '/admin/locales/:localeId/split-words',
    body: splitWordRequest.array(),
    responses: {
      200: splitWordAttributes.array(),
    },
    summary: 'Set locale split words',
    description: 'Set locale split words',
  },
});
