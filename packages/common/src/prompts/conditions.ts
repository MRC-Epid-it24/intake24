import isEqual from 'lodash/isEqual';
import { z } from 'zod';

export type ConditionInput = number | string | (number | string)[] | null;
export type ConditionInputOps = { value: ConditionInput; answer: ConditionInput };

function toNumber(values: ConditionInput) {
  return (Array.isArray(values) ? values : [values])
    .map(value => (typeof value === 'string' ? Number.parseFloat(value) : value))
    .filter((value): value is number => !Number.isNaN(value));
}

function toString(values: ConditionInput) {
  return (Array.isArray(values) ? values : [values])
    .map(value => value?.toString().trim().toLowerCase() || '')
    .filter(Boolean);
}

export const ops = ['eq', 'ne', 'in', 'notIn', 'gte', 'gt', 'lte', 'lt'] as const;

export const conditionOps = {
  eq: ({ answer, value }: ConditionInputOps) => isEqual(toString(answer), toString(value)),
  ne: ({ answer, value }: ConditionInputOps) => !isEqual(toString(answer), toString(value)),
  in: ({ answer, value }: ConditionInputOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.some(item => values.includes(item));
  },
  notIn: ({ answer, value }: ConditionInputOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.every(item => !values.includes(item));
  },
  gte: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] >= values[0];
  },
  gt: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] > values[0];
  },
  lte: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] <= values[0];
  },
  lt: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] < values[0];
  },
};

export type ConditionOps = typeof conditionOps;

export type ConditionOp = keyof ConditionOps;

export const conditionTypes = [
  'drinks',
  'energy',
  'flag',
  'foodCategory',
  'meals',
  'promptAnswer',
  'property',
  'recallNumber',
] as const;

export type ConditionType = (typeof conditionTypes)[number];

export const conditionSections = ['survey', 'meal', 'food'] as const;
export type ConditionSection = (typeof conditionSections)[number];

const baseCondition = z.object({
  type: z.enum(conditionTypes),
  op: z.enum(ops),
  value: z.union([z.string(), z.string().array()]),
});

export type BaseCondition = z.infer<typeof baseCondition>;

const drinksCondition = baseCondition.extend({
  type: z.literal('drinks'),
  props: z.object({
    section: z.enum(conditionSections),
  }),
});

const energyCondition = baseCondition.extend({
  type: z.literal('energy'),
  props: z.object({
    section: z.enum(conditionSections),
  }),
});

const flagCondition = baseCondition.extend({
  type: z.literal('flag'),
  props: z.object({
    section: z.enum(conditionSections),
  }),
});

const foodCategoryCondition = baseCondition.extend({
  type: z.literal('foodCategory'),
  props: z.record(z.never()),
});

const mealsCondition = baseCondition.extend({
  type: z.literal('meals'),
  props: z.record(z.never()),
});

const promptAnswerCondition = baseCondition.extend({
  type: z.literal('promptAnswer'),
  props: z.object({
    promptId: z.string(),
    section: z.enum(conditionSections),
  }),
});

const propertyCondition = baseCondition.extend({
  type: z.literal('property'),
  props: z.object({
    name: z.enum(['recallNumber', 'userName']),
  }),
});

const recallNumberCondition = baseCondition.extend({
  type: z.literal('recallNumber'),
  props: z.record(z.never()),
});

export const conditions = z.object({
  drinks: drinksCondition,
  energy: energyCondition,
  flag: flagCondition,
  foodCategory: foodCategoryCondition,
  mealsC: mealsCondition,
  promptAnswer: promptAnswerCondition,
  property: propertyCondition,
  recallNumber: recallNumberCondition,
});

export type Conditions = z.infer<typeof conditions>;

export const condition = z.union([
  drinksCondition,
  energyCondition,
  flagCondition,
  foodCategoryCondition,
  mealsCondition,
  promptAnswerCondition,
  propertyCondition,
  recallNumberCondition,
]);

export type Condition = z.infer<typeof condition>;
