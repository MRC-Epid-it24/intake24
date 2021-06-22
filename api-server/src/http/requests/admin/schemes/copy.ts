import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { id, name } from './defaults';

export default validate(
  checkSchema({
    sourceId: {
      in: ['body'],
      errorMessage: 'Invalid source Scheme ID.',
      isString: true,
      isEmpty: { negated: true },
    },
    id,
    name,
  })
);
