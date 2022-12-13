export type ConditionOpInput = [number | string, number | string | (number | string)[]];

const toNumber = (values: ConditionOpInput) =>
  values.flat().map((value) => (typeof value === 'string' ? parseFloat(value) : value));

const toString = (values: ConditionOpInput) =>
  values.flat().map((value) => value?.toString() || '');

export const conditionOps = {
  eq: (values: ConditionOpInput) => {
    const [value, ...answer] = toString(values);
    return answer.length === 1 ? value === answer[0] : answer.includes(value);
  },
  ne: (values: ConditionOpInput) => {
    const [value, ...answer] = toString(values);
    return answer.length === 1 ? value !== answer[0] : !answer.includes(value);
  },
  gte: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return answer >= value;
  },
  gt: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return answer > value;
  },
  lte: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return answer <= value;
  },
  lt: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return answer < value;
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

export type ConditionType = typeof conditionTypes[number];

export type ConditionSection = 'survey' | 'meal' | 'food';

export type BaseCondition = { type: ConditionType; op: ConditionOp; value: string };

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
