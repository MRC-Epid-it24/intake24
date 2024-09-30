import type { ConditionOpCode } from '@intake24/common/prompts';

export const opToIconMap: Record<ConditionOpCode, string> = {
  eq: 'fas fa-equals',
  ne: 'fas fa-not-equal',
  in: 'far fa-circle-dot',
  notIn: 'far fa-circle',
  setEq: 'fas fa-list',
  gte: 'fas fa-greater-than-equal',
  gt: 'fas fa-greater-than',
  lte: 'fas fa-less-than-equal',
  lt: 'fas fa-less-than',
};
