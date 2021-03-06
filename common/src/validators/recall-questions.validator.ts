/* tslint:disable */
// generated by typescript-json-validator
import { inspect } from 'util';
import Ajv = require('ajv');
import { RecallQuestions } from '../types/recall';
export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  format: 'fast',
  nullable: true,
  unicode: true,
  uniqueItems: true,
  useDefaults: true,
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { RecallQuestions };
export const RecallQuestionsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  defaultProperties: [],
  definitions: {
    ComponentType: {
      enum: [
        'checkbox-list-prompt',
        'date-picker-prompt',
        'info-prompt',
        'radio-list-prompt',
        'submit-prompt',
        'textarea-prompt',
        'time-picker-prompt',
      ],
      type: 'string',
    },
    'PromptQuestion<Dictionary<any>>': {
      additionalProperties: false,
      defaultProperties: [],
      properties: {
        component: {
          $ref: '#/definitions/ComponentType',
        },
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        props: {
          additionalProperties: {
            $ref: '#/definitions/T',
          },
          defaultProperties: [],
          type: 'object',
        },
      },
      required: ['component', 'id', 'name', 'props'],
      type: 'object',
    },
    'PromptQuestion<Dictionary<any>>_1': {
      additionalProperties: false,
      defaultProperties: [],
      properties: {
        component: {
          $ref: '#/definitions/ComponentType',
        },
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        props: {
          additionalProperties: {
            $ref: '#/definitions/T',
          },
          defaultProperties: [],
          type: 'object',
        },
      },
      required: ['component', 'id', 'name', 'props'],
      type: 'object',
    },
    'Record<MealSection,PromptQuestion<Dictionary<any>>[]>': {
      additionalProperties: false,
      defaultProperties: [],
      properties: {
        foods: {
          items: {
            $ref: '#/definitions/PromptQuestion<Dictionary<any>>',
          },
          type: 'array',
        },
        postFoods: {
          items: {
            $ref: '#/definitions/PromptQuestion<Dictionary<any>>',
          },
          type: 'array',
        },
        preFoods: {
          items: {
            $ref: '#/definitions/PromptQuestion<Dictionary<any>>',
          },
          type: 'array',
        },
      },
      required: ['foods', 'postFoods', 'preFoods'],
      type: 'object',
    },
    T: {
      additionalProperties: false,
      defaultProperties: [],
      type: 'object',
    },
  },
  properties: {
    meals: {
      $ref: '#/definitions/Record<MealSection,PromptQuestion<Dictionary<any>>[]>',
    },
    postMeals: {
      items: {
        $ref: '#/definitions/PromptQuestion<Dictionary<any>>_1',
      },
      type: 'array',
    },
    preMeals: {
      items: {
        $ref: '#/definitions/PromptQuestion<Dictionary<any>>_1',
      },
      type: 'array',
    },
    submission: {
      items: {
        $ref: '#/definitions/PromptQuestion<Dictionary<any>>_1',
      },
      type: 'array',
    },
  },
  required: ['meals', 'postMeals', 'preMeals', 'submission'],
  type: 'object',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<Ajv.ValidateFunction, 'errors'>;
export const isRecallQuestions = ajv.compile(
  RecallQuestionsSchema
) as ValidateFunction<RecallQuestions>;
export default function validate(value: unknown): RecallQuestions {
  if (isRecallQuestions(value)) {
    return value;
  } else {
    throw new Error(
      ajv.errorsText(
        isRecallQuestions.errors!.filter((e: any) => e.keyword !== 'if'),
        { dataVar: 'RecallQuestions' }
      ) +
        '\n\n' +
        inspect(value)
    );
  }
}
