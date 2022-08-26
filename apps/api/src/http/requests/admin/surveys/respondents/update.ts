import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { identifiers, password as passFields } from '../../users/defaults';

const { password, passwordConfirm } = passFields;

export default validate(
  checkSchema({
    ...identifiers,
    password: {
      ...password,
      optional: { options: { nullable: true } },
    },
    passwordConfirm: {
      ...passwordConfirm,
      optional: { options: { nullable: true } },
    },
  })
);
