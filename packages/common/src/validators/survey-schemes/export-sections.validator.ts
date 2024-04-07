import { inspect } from 'node:util';

import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';

import type { ExportSections } from '../../surveys';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line ts/no-var-requires, ts/no-require-imports
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export type { ExportSections };
export const ExportSectionsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    ExportSectionId: {
      enum: [
        'food',
        'foodCustom',
        'foodFields',
        'foodNutrients',
        'meal',
        'mealCustom',
        'portionSizes',
        'survey',
        'submission',
        'submissionCustom',
        'user',
        'userCustom',
      ],
      type: 'string',
    },
  },
  items: {
    additionalProperties: false,
    properties: {
      fields: {
        items: {
          additionalProperties: false,
          properties: {
            id: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
          },
          required: ['id', 'label'],
          type: 'object',
        },
        type: 'array',
      },
      id: {
        $ref: '#/definitions/ExportSectionId',
      },
    },
    required: ['fields', 'id'],
    type: 'object',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isExportSections = ajv.compile(
  ExportSectionsSchema,
) as ValidateFunction<ExportSections>;
export default function validate(value: unknown): ExportSections {
  if (isExportSections(value))
    return value;

  throw new Error(
    `${ajv.errorsText(
      isExportSections.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'ExportSections' },
    )}\n\n${inspect(value)}`,
  );
}
