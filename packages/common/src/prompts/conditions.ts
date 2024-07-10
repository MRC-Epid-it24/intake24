import isEqual from 'lodash/isEqual';
import { z } from 'zod';

export const conditionOpCodes = ['eq', 'ne', 'setEq', 'in', 'notIn', 'gte', 'gt', 'lte', 'lt'] as const;
export type ConditionOpCode = typeof conditionOpCodes[number];

export type ConditionValue = z.infer<typeof valueCheck.shape.value>;
export type ConditionValueOps = { value: ConditionValue; answer: ConditionValue };

function toNumber(values: ConditionValue) {
  return (Array.isArray(values) ? values : [values])
    .map(value => (typeof value === 'string' ? Number.parseFloat(value) : value))
    .filter((value): value is number => !Number.isNaN(value));
}

function toString(values: ConditionValue) {
  return (Array.isArray(values) ? values : [values])
    .map(value => value?.toString().trim().toLowerCase() || '')
    .filter(Boolean);
}

export const conditionOps = {
  eq: ({ answer, value }: ConditionValueOps) => isEqual(toString(answer), toString(value)),
  setEq: ({ answer, value }: ConditionValueOps) => isEqual(toString(answer), toString(value)),
  ne: ({ answer, value }: ConditionValueOps) => !isEqual(toString(answer), toString(value)),
  in: ({ answer, value }: ConditionValueOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.some(item => values.includes(item));
  },
  notIn: ({ answer, value }: ConditionValueOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.every(item => !values.includes(item));
  },
  gte: ({ answer, value }: ConditionValueOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] >= values[0];
  },
  gt: ({ answer, value }: ConditionValueOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] > values[0];
  },
  lte: ({ answer, value }: ConditionValueOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] <= values[0];
  },
  lt: ({ answer, value }: ConditionValueOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length)
      return false;

    return answers[0] < values[0];
  },
};

export const mealCompletionStateOptions = ['freeEntryComplete', 'searchComplete', 'portionSizeComplete', 'complete'] as const;

export type MealCompletionState = typeof mealCompletionStateOptions[number];

const valueCheck = z.object({
  op: z.enum(conditionOpCodes),
  value: z.union([z.string().or(z.number()), z.string().or(z.number()).array()]).nullable(),
});

const valueProperty = z.object({
  type: z.literal('value'),
  check: valueCheck,
});

const booleanProperty = z.object({
  type: z.literal('boolean'),
  check: z.object({
    value: z.boolean(),
  }),
});

const drinksProperty = booleanProperty.extend({
  id: z.literal('drinks'),
});

const energyProperty = valueProperty.extend({
  id: z.literal('energy'),
});

const flagProperty = z.object({
  id: z.literal('flag'),
  type: z.literal('flag'),
  check: z.object({
    flagId: z.string(),
    value: z.boolean(),
  }),
});

const foodCategoryProperty = valueProperty.extend({
  id: z.literal('foodCategory'),
});

const promptAnswerProperty = z.object({
  id: z.literal('promptAnswer'),
  type: z.literal('promptAnswer'),
  check: valueCheck.extend({
    promptId: z.string(),
  }),
});

const recallNumberProperty = valueProperty.extend({
  id: z.literal('recallNumber'),
});

const userNameProperty = valueProperty.extend({
  id: z.literal('userName'),
});

const mealCompletionProperty = z.object({
  id: z.literal('mealCompletion'),
  type: z.literal('mealCompletion'),
  check: z.object({
    completionState: z.enum(mealCompletionStateOptions),
  }),
});

const numberOfMealsProperty = valueProperty.extend({
  id: z.literal('numberOfMeals'),
});

export const commonProperties = [
  energyProperty,
  drinksProperty,
  flagProperty,
  promptAnswerProperty,
] as const;

export const surveyProperties = z.discriminatedUnion('id', [
  ...commonProperties,
  mealCompletionProperty,
  recallNumberProperty,
  userNameProperty,
  numberOfMealsProperty,
]);

export const mealProperties = z.discriminatedUnion('id', [
  ...commonProperties,
  mealCompletionProperty,
]);

export const foodProperties = z.discriminatedUnion('id', [
  ...commonProperties,
  foodCategoryProperty,
]);

const surveyCondition = z.object({ object: z.literal('survey'), property: surveyProperties });

const mealCondition = z.object({ object: z.literal('meal'), property: mealProperties });

const foodCondition = z.object({ object: z.literal('food'), property: foodProperties });

export const condition = z.discriminatedUnion('object', [
  surveyCondition,
  mealCondition,
  foodCondition,
]);

export type ValueProperty = z.infer<typeof valueProperty>;
export type BooleanProperty = z.infer<typeof booleanProperty>;
export type DrinksProperty = z.infer<typeof drinksProperty>;
export type EnergyProperty = z.infer<typeof energyProperty>;
export type FlagProperty = z.infer<typeof flagProperty>;
export type PromptAnswerProperty = z.infer<typeof promptAnswerProperty>;

export type ValuePropertyCheck = z.infer<typeof valueCheck>;
export type BooleanPropertyCheck = z.infer<typeof booleanProperty.shape.check>;
export type MealCompletionPropertyCheck = z.infer<typeof mealCompletionProperty.shape.check>;
export type FlagPropertyCheck = z.infer<typeof flagProperty.shape.check>;
export type PromptAnswerPropertyCheck = z.infer<typeof promptAnswerProperty.shape.check>;

export type Condition = z.infer<typeof condition>;
export type ConditionObjectId = Condition['object'];

export type ObjectCondition<T extends ConditionObjectId> = Extract<Condition, { object: T }>;
export type ObjectProperty<T extends ConditionObjectId> = ObjectCondition<T>['property'];
export type ObjectPropertyId<T extends ConditionObjectId> = ObjectCondition<T>['property']['id'];

export const conditionObjectIds = condition.options.map(option => option.shape.object.value);

// Not sure how to keep ObjectPropertyId<ConditionObjectId> generic here instead of expanding to
// the union of all possible property ids
export const conditionObjectPropertyIds: Map<ConditionObjectId, ObjectPropertyId<ConditionObjectId>[]> = new Map((condition.options.map((condition) => {
  const objectId = condition.shape.object.value;
  const propertyIds = condition.shape.property.options.map(property => property.shape.id.value);
  return [objectId, propertyIds];
})));
