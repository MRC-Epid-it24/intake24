import { inspect } from 'util';
import Ajv, { ValidateFunction as AjvValidateFunction } from 'ajv';
import { RecallQuestions } from '../../schemes';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { RecallQuestions };
export const RecallQuestionsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    BasePromptProps: {
      properties: {
        conditions: {
          items: {
            $ref: '#/definitions/Condition<Dictionary<any>>',
          },
          type: 'array',
        },
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
        text: {
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
      },
      required: ['conditions', 'description', 'text'],
      type: 'object',
    },
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
    'Condition<Dictionary<any>>': {
      properties: {
        op: {
          $ref: '#/definitions/ConditionOp',
        },
        props: {
          additionalProperties: {
            $ref: '#/definitions/T_1',
          },
          type: 'object',
        },
        type: {
          $ref: '#/definitions/ConditionType',
        },
        value: {
          type: 'string',
        },
      },
      required: ['op', 'props', 'type', 'value'],
      type: 'object',
    },
    ConditionOp: {
      enum: ['eq', 'gt', 'gte', 'lt', 'lte', 'ne'],
      type: 'string',
    },
    ConditionType: {
      enum: ['promptAnswer', 'recallNumber'],
      type: 'string',
    },
    'PromptQuestion<BasePromptProps>': {
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
          $ref: '#/definitions/BasePromptProps',
        },
      },
      required: ['component', 'id', 'name', 'props'],
      type: 'object',
    },
    'PromptQuestion<BasePromptProps>_1': {
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
          $ref: '#/definitions/BasePromptProps',
        },
      },
      required: ['component', 'id', 'name', 'props'],
      type: 'object',
    },
    'Record<MealSection,PromptQuestion<BasePromptProps>[]>': {
      properties: {
        foods: {
          items: {
            $ref: '#/definitions/PromptQuestion<BasePromptProps>',
          },
          type: 'array',
        },
        postFoods: {
          items: {
            $ref: '#/definitions/PromptQuestion<BasePromptProps>',
          },
          type: 'array',
        },
        preFoods: {
          items: {
            $ref: '#/definitions/PromptQuestion<BasePromptProps>',
          },
          type: 'array',
        },
      },
      required: ['foods', 'postFoods', 'preFoods'],
      type: 'object',
    },
    T: {
      type: ['null', 'string'],
    },
    T_1: {
      type: 'object',
    },
  },
  properties: {
    meals: {
      $ref: '#/definitions/Record<MealSection,PromptQuestion<BasePromptProps>[]>',
    },
    postMeals: {
      items: {
        $ref: '#/definitions/PromptQuestion<BasePromptProps>_1',
      },
      type: 'array',
    },
    preMeals: {
      items: {
        $ref: '#/definitions/PromptQuestion<BasePromptProps>_1',
      },
      type: 'array',
    },
    submission: {
      items: {
        $ref: '#/definitions/PromptQuestion<BasePromptProps>_1',
      },
      type: 'array',
    },
  },
  required: ['meals', 'postMeals', 'preMeals', 'submission'],
  type: 'object',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isRecallQuestions = ajv.compile(
  RecallQuestionsSchema
) as ValidateFunction<RecallQuestions>;
export default function validate(value: unknown): RecallQuestions {
  if (isRecallQuestions(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isRecallQuestions.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'RecallQuestions' }
    )}\n\n${inspect(value)}`
  );
}
