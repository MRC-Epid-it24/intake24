import { inspect } from 'util';
import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import type { DemographicGroups } from '../../feedback/demographic-groups';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { DemographicGroups };
export const DemographicGroupsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    NutrientRuleType: {
      enum: ['energy_divided_by_bmr', 'per_unit_of_weight', 'percentage_of_energy', 'range'],
      type: 'string',
    },
    Sentiment: {
      enum: ['bit_high', 'bit_low', 'excellent', 'good', 'high', 'low', 'too_high', 'too_low'],
      type: 'string',
    },
    T: {
      type: 'object',
    },
  },
  items: {
    properties: {
      age: {
        anyOf: [
          {
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
          {
            type: 'null',
          },
        ],
      },
      height: {
        anyOf: [
          {
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
          {
            type: 'null',
          },
        ],
      },
      id: {
        type: 'string',
      },
      nutrientRuleType: {
        $ref: '#/definitions/NutrientRuleType',
      },
      nutrientTypeId: {
        type: 'string',
      },
      physicalActivityLevelId: {
        type: ['null', 'string'],
      },
      scaleSectors: {
        items: {
          properties: {
            description: {
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
            name: {
              allOf: [
                {
                  properties: {
                    en: {
                      type: 'string',
                    },
                  },
                  required: ['en'],
                  type: 'object',
                },
                {
                  additionalProperties: {
                    type: ['null', 'string'],
                  },
                  type: 'object',
                },
              ],
            },
            range: {
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
            sentiment: {
              $ref: '#/definitions/Sentiment',
            },
          },
          required: ['description', 'name', 'range', 'sentiment'],
          type: 'object',
        },
        type: 'array',
      },
      sex: {
        anyOf: [
          {
            enum: ['f', 'm'],
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
      },
      type: {
        enum: ['demographic-group'],
        type: 'string',
      },
      weight: {
        anyOf: [
          {
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
          {
            type: 'null',
          },
        ],
      },
    },
    required: [
      'age',
      'height',
      'id',
      'nutrientRuleType',
      'nutrientTypeId',
      'physicalActivityLevelId',
      'scaleSectors',
      'sex',
      'type',
      'weight',
    ],
    type: 'object',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isDemographicGroups = ajv.compile(
  DemographicGroupsSchema
) as ValidateFunction<DemographicGroups>;
export default function validate(value: unknown): DemographicGroups {
  if (isDemographicGroups(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isDemographicGroups.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'DemographicGroups' }
    )}\n\n${inspect(value)}`
  );
}
