import type { ValidateFunction as AjvValidateFunction } from 'ajv';

import type Config from './config';
import { inspect } from 'node:util';

import Ajv from 'ajv';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line ts/no-require-imports
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export type { Config };
export const ConfigSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    batchSize: {
      type: 'number',
    },
    energyValueKcal: {
      type: 'number',
    },
    foodFilter: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    guideImageWidth: {
      type: 'number',
    },
    locale: {
      type: 'string',
    },
    portionSizeFilter: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
  },
  required: [
    'batchSize',
    'energyValueKcal',
    'foodFilter',
    'guideImageWidth',
    'locale',
    'portionSizeFilter',
  ],
  type: 'object',
};
export type ValidateFunction<T> = ((data: unknown) => data is T)
  & Pick<AjvValidateFunction, 'errors'>;
export const isConfig = ajv.compile(ConfigSchema) as ValidateFunction<Config>;
export default function validate(value: unknown): Config {
  if (isConfig(value))
    return value;

  throw new Error(
    `${ajv.errorsText(
      isConfig.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'Config' },
    )}\n\n${inspect(value)}`,
  );
}
