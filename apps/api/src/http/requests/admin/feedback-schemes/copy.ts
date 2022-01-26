import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { FeedbackScheme } from '@intake24/db';
import { name } from './defaults';

export default validate(
  checkSchema({
    sourceId: {
      in: ['body'],
      errorMessage: 'Invalid source Feedback scheme ID.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> => {
          const feedbackScheme = await FeedbackScheme.findOne({ where: { id: value } });
          if (!feedbackScheme) throw new Error('Invalid source Feedback scheme ID.');
        },
      },
    },
    name,
  })
);
