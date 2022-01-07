import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';

export default validate(
  checkSchema({
    app: {
      in: ['query'],
      isIn: { options: [['admin', 'survey']] },
    },
  })
);
