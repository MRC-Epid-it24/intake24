import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { defaults, surveySchemeOverrides, userPersonalData } from './defaults';

export default validate(checkSchema({ ...defaults, ...userPersonalData, surveySchemeOverrides }));
