import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { identifiers, password as passFields } from '../defaults';

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
