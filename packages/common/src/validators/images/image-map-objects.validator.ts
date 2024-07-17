import { inspect } from 'node:util';

import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';

import type { ImageMapInputObjects } from '../../types/http/admin/image-maps';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line ts/no-require-imports
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export type { ImageMapInputObjects };
export const ImageMapInputObjectsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  items: {
    properties: {
      description: {
        type: 'string',
      },
      id: {
        type: 'string',
      },
      outlineCoordinates: {
        items: {
          type: 'number',
        },
        type: 'array',
      },
    },
    required: ['description', 'id', 'outlineCoordinates'],
    type: 'object',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isImageMapInputObjects = ajv.compile(
  ImageMapInputObjectsSchema,
) as ValidateFunction<ImageMapInputObjects>;
export default function validate(value: unknown): ImageMapInputObjects {
  if (isImageMapInputObjects(value))
    return value;

  throw new Error(
    `${ajv.errorsText(
      isImageMapInputObjects.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'ImageMapInputObjects' },
    )}\n\n${inspect(value)}`,
  );
}
