import { initContract } from '@ts-rest/core';

import {
  splitListAttributes,
  splitListRequest,
} from '@intake24/common/types/http/admin';

export const splitList = initContract().router({
  get: {
    method: 'GET',
    path: '/admin/locales/:localeId/split-lists',
    responses: {
      200: splitListAttributes.array(),
    },
    summary: 'Browse locale split lists',
    description: 'Browse locale split lists',
  },
  set: {
    method: 'POST',
    path: '/admin/locales/:localeId/split-lists',
    body: splitListRequest.array(),
    responses: {
      200: splitListAttributes.array(),
    },
    summary: 'Set locale split lists',
    description: 'Set locale split lists',
  },
});
