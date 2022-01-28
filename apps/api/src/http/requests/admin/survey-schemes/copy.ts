import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { name } from './defaults';

export default validate(
  checkSchema({
    sourceId: {
      in: ['body'],
      errorMessage: 'Invalid source Survey scheme ID.',
      isString: true,
      isEmpty: { negated: true },
    },
    name,
  })
);
