import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { bigIntString as foodGroupId, paginationMeta, paginationRequest } from '@intake24/common/types/http';
import {
  foodGroupAttributes,
  foodGroupRequest,
} from '@intake24/common/types/http/admin';

export const foodGroup = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/food-groups',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: foodGroupAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse food groups',
    description: 'Browse food groups (paginated list)',
  },
  store: {
    method: 'POST',
    path: '/admin/food-groups',
    body: foodGroupRequest,
    responses: {
      201: foodGroupAttributes,
    },
    summary: 'Create food group',
    description: 'Create new food group',
  },
  read: {
    method: 'GET',
    path: '/admin/food-groups/:foodGroupId',
    pathParams: z.object({ foodGroupId }),
    responses: {
      200: foodGroupAttributes,
    },
    summary: 'Get food group',
    description: 'Get food group by id',
  },
  update: {
    method: 'PUT',
    path: '/admin/food-groups/:foodGroupId',
    pathParams: z.object({ foodGroupId }),
    body: foodGroupRequest,
    responses: {
      200: foodGroupAttributes,
    },
    summary: 'Update food group',
    description: 'Update food group by id',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/food-groups/:foodGroupId',
    pathParams: z.object({ foodGroupId }),
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete food group',
    description: 'Delete food group by id',
  },
});
