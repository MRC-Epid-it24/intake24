import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import { inspect } from 'util';

import type { HenryCoefficients } from '../../feedback/henry-coefficients';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { HenryCoefficients };
export const HenryCoefficientsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    Sex: {
      enum: ['f', 'm'],
      type: 'string',
    },
  },
  items: {
    properties: {
      age: {
        properties: {
          end: {
            type: 'number',
          },
          start: {
            type: 'number',
          },
        },
        required: ['end', 'start'],
        type: 'object',
      },
      constant: {
        type: 'number',
      },
      heightCoefficient: {
        type: 'number',
      },
      id: {
        type: 'string',
      },
      sex: {
        $ref: '#/definitions/Sex',
      },
      weightCoefficient: {
        type: 'number',
      },
    },
    required: ['age', 'constant', 'heightCoefficient', 'id', 'sex', 'weightCoefficient'],
    type: 'object',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isHenryCoefficients = ajv.compile(
  HenryCoefficientsSchema
) as ValidateFunction<HenryCoefficients>;
export default function validate(value: unknown): HenryCoefficients {
  if (isHenryCoefficients(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isHenryCoefficients.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'HenryCoefficients' }
    )}\n\n${inspect(value)}`
  );
}
