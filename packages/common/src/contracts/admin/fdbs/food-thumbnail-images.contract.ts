import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const foodThumbnailImages = initContract().router({
  update: {
    method: 'PUT',
    path: '/admin/fdbs/:localeId/:foodCode/thumbnail',
    contentType: 'multipart/form-data',
    body: z.object({
      image: z.custom<File>(),
    }),
    pathParams: z.object({ localeId: z.string(), foodCode: z.string() }),
    responses: {
      200: z.undefined(),
      404: z.undefined(),
    },
    summary: 'Update food image thumbnail',
    description: 'Update food image thumbnail',
  },
});
