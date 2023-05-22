import isEqual from 'lodash/isEqual';

export type ConditionInput = number | string | (number | string)[];
export type ConditionInputOps = { value: ConditionInput; answer: ConditionInput };

const toNumber = (values: ConditionInput) =>
  (Array.isArray(values) ? values : [values])
    .map((value) => (typeof value === 'string' ? parseFloat(value) : value))
    .filter((value) => !Number.isNaN(value));

const toString = (values: ConditionInput) =>
  (Array.isArray(values) ? values : [values])
    .map((value) => value?.toString().trim().toLowerCase() || '')
    .filter(Boolean);

export const conditionOps = {
  eq: ({ answer, value }: ConditionInputOps) => isEqual(toString(answer), toString(value)),
  ne: ({ answer, value }: ConditionInputOps) => !isEqual(toString(answer), toString(value)),
  in: ({ answer, value }: ConditionInputOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.some((item) => values.includes(item));
  },
  notIn: ({ answer, value }: ConditionInputOps) => {
    const values = toString(value);
    const answers = toString(answer);

    return answers.every((item) => !values.includes(item));
  },
  gte: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length) return false;

    return answers[0] >= values[0];
  },
  gt: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length) return false;

    return answers[0] > values[0];
  },
  lte: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length) return false;

    return answers[0] <= values[0];
  },
  lt: ({ answer, value }: ConditionInputOps) => {
    const values = toNumber(value);
    const answers = toNumber(answer);

    if (!values.length || !answers.length) return false;

    return answers[0] < values[0];
  },
};

export type ConditionOps = typeof conditionOps;

export type ConditionOp = keyof ConditionOps;

export const conditionTypes = [
  'drinks',
  'energy',
  'promptAnswer',
  'recallNumber',
  'foodCategory',
] as const;

export type ConditionType = (typeof conditionTypes)[number];

export type ConditionSection = 'survey' | 'meal' | 'food';

export type BaseCondition = { type: ConditionType; op: ConditionOp; value: string | string[] };

export type Conditions = {
  drinks: BaseCondition & {
    type: 'drinks';
    props: {
      section: ConditionSection;
    };
  };
  energy: BaseCondition & {
    type: 'energy';
    props: {
      section: ConditionSection;
    };
  };
  promptAnswer: BaseCondition & {
    type: 'promptAnswer';
    props: {
      promptId: string;
      section: ConditionSection;
    };
  };
  recallNumber: BaseCondition & {
    type: 'recallNumber';
    props: {};
  };
  foodCategory: BaseCondition & {
    type: 'foodCategory';
    props: {
      section: ConditionSection;
      categoryId: string;
    };
  };
};

export type Condition = Conditions[keyof Conditions];
