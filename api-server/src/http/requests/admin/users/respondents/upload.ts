import { checkSchema } from 'express-validator';
import path from 'path';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    file: {
      in: ['body'],
      custom: {
        options: async (value, { req: { file } }): Promise<void> => {
          if (!file) throw new Error(`Missing CSV file.`);

          if (path.extname(file.originalname).toLowerCase() !== '.csv')
            throw new Error(`Invalid file type - expecting CSV (comma-delimited) file.`);

          return Promise.resolve();
        },
      },
    },
  })
);
