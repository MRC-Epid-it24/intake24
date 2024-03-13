import type { Card, CardType } from '@intake24/common/feedback';

const baseTab = ['general', 'content'];
const customTab = [...baseTab, 'unit', 'thresholds'];

export type CardSettingsRecord = {
  tabs: string[];
};

export type CardSettings = Record<CardType, CardSettingsRecord>;

export const cardSettings: CardSettings = {
  character: {
    tabs: [...baseTab],
  },
  'nutrient-group': {
    tabs: [...customTab, 'nutrients'],
  },
  'five-a-day': {
    tabs: [...customTab],
  },
};
