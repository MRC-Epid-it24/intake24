import path from 'node:path';

import type { ParamSchema } from 'express-validator';

import { customTypeErrorMessage } from '@intake24/api/http/requests/util';

export const csvFile: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value, meta): Promise<void> => {
      const { file } = meta.req;
      if (!file) throw new Error(customTypeErrorMessage('file._', meta));

      if (path.extname(file.originalname).toLowerCase() !== '.csv')
        throw new Error(customTypeErrorMessage('file.ext', meta, { ext: 'CSV (comma-delimited)' }));
    },
  },
};

export const imageFile: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value, meta): Promise<void> => {
      const { file } = meta.req;
      if (!file) throw new Error(customTypeErrorMessage('file._', meta));

      if (file.mimetype.toLowerCase() !== 'image/jpeg')
        throw new Error(customTypeErrorMessage('file.mime', meta, { mime: 'image/jpeg' }));
    },
  },
};
