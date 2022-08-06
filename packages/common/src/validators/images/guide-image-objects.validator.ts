import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import { inspect } from 'util';

import type { GuideImageInputObjects } from '../../types/http/admin/guide-images';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { GuideImageInputObjects };
export const GuideImageInputObjectsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    'Pick<GuideImageEntryObject,"weight"|"id">': {
      properties: {
        id: {
          type: 'string',
        },
        weight: {
          type: 'number',
        },
      },
      required: ['id', 'weight'],
      type: 'object',
    },
  },
  items: {
    $ref: '#/definitions/Pick<GuideImageEntryObject,"weight"|"id">',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isGuideImageInputObjects = ajv.compile(
  GuideImageInputObjectsSchema
) as ValidateFunction<GuideImageInputObjects>;
export default function validate(value: unknown): GuideImageInputObjects {
  if (isGuideImageInputObjects(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isGuideImageInputObjects.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'GuideImageInputObjects' }
    )}\n\n${inspect(value)}`
  );
}
