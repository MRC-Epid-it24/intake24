import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { inspect } from 'util';

import type { PushSubscription } from '@intake24/db';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

//FIX: Workaround with AJV issue om MacOS: https://github.com/ajv-validator/ajv-formats/issues/69
if (!ajv.opts) {
  // @ts-ignore
  ajv.opts = { code: {}, allErrors: true, coerceTypes: false, useDefaults: true };
}

addFormats(ajv, { /* mode: 'fast', */ formats: ['date-time'] });

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { PushSubscription };
export const PushSubscriptionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  properties: {
    endpoint: {
      type: 'string',
    },
    expirationTime: {
      anyOf: [
        {
          description: 'Enables basic storage and retrieval of dates and times.',
          format: 'date-time',
          type: 'string',
        },
        {
          type: ['null', 'number'],
        },
      ],
    },
    keys: {
      additionalProperties: false,
      properties: {
        auth: {
          type: 'string',
        },
        p256dh: {
          type: 'string',
        },
      },
      required: ['auth', 'p256dh'],
      type: 'object',
    },
  },
  required: ['endpoint', 'keys'],
  type: 'object',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isPushSubscription = ajv.compile(
  PushSubscriptionSchema
) as ValidateFunction<PushSubscription>;
export default function validate(value: unknown): PushSubscription {
  if (isPushSubscription(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isPushSubscription.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'PushSubscription' }
    )}\n\n${inspect(value)}`
  );
}
