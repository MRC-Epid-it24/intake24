import { Dictionary } from '../types/common';

export const conditionTypes = [
  'surveyPromptAnswer',
  'mealPromptAnswer',
  'foodPromptAnswer',
  'recallNumber',
] as const;

export type ConditionType = typeof conditionTypes[number];

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
    return value >= answer;
  },
  gt: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return value > answer;
  },
  lte: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return value <= answer;
  },
  lt: (values: ConditionOpInput) => {
    const [value, answer] = toNumber(values);
    return value < answer;
  },
};

export type ConditionOps = typeof conditionOps;

export type ConditionOp = keyof ConditionOps;

export interface Condition<T = Dictionary> {
  type: ConditionType;
  op: ConditionOp;
  value: string;
  props: T;
}
