import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { csvFile } from '../generic';

export default validate(checkSchema({ file: csvFile }));
