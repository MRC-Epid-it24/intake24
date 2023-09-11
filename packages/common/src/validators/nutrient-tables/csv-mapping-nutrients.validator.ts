import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import { inspect } from 'util';

import type { NutrientTableCsvMappingNutrientsInput } from '../../types/http/admin/nutrient-tables';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { NutrientTableCsvMappingNutrientsInput };
export const NutrientTableCsvMappingNutrientsInputSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    'Pick<NutrientTableCsvMappingNutrientAttributes,"columnOffset"|"nutrientTypeId">': {
      properties: {
        columnOffset: {
          type: 'number',
        },
        nutrientTypeId: {
          type: 'string',
        },
      },
      required: ['columnOffset', 'nutrientTypeId'],
      type: 'object',
    },
  },
  items: {
    $ref: '#/definitions/Pick<NutrientTableCsvMappingNutrientAttributes,"columnOffset"|"nutrientTypeId">',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isNutrientTableCsvMappingNutrientsInput = ajv.compile(
  NutrientTableCsvMappingNutrientsInputSchema
) as ValidateFunction<NutrientTableCsvMappingNutrientsInput>;
export default function validate(value: unknown): NutrientTableCsvMappingNutrientsInput {
  if (isNutrientTableCsvMappingNutrientsInput(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isNutrientTableCsvMappingNutrientsInput.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'NutrientTableCsvMappingNutrientsInput' }
    )}\n\n${inspect(value)}`
  );
}