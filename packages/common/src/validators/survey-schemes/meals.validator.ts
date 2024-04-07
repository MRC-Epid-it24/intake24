import { inspect } from 'node:util';

import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';

import type { Meals } from '../../types/meals';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line ts/no-var-requires, ts/no-require-imports
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export type { Meals };
export const MealsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    T: {
      type: ['null', 'string'],
    },
  },
  items: {
    properties: {
      name: {
        additionalProperties: {
          $ref: '#/definitions/T',
        },
        properties: {
          en: {
            type: ['null', 'string'],
          },
        },
        required: ['en'],
        type: 'object',
      },
      time: {
        type: 'string',
      },
    },
    required: ['name', 'time'],
    type: 'object',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isMeals = ajv.compile(MealsSchema) as ValidateFunction<Meals>;
export default function validate(value: unknown): Meals {
  if (isMeals(value))
    return value;

  throw new Error(
    `${ajv.errorsText(
      isMeals.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'Meals' },
    )}\n\n${inspect(value)}`,
  );
}
