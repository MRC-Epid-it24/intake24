import type { CardType } from '@intake24/common/feedback';

export type CardSettingsRecord = {
  tabs: string[];
};

export type CardSettings = Record<CardType, CardSettingsRecord>;

export const cardSettings: CardSettings = {
  character: {
    tabs: ['general', 'content'],
  },
  'nutrient-group': {
    tabs: ['general', 'unit', 'thresholds', 'nutrients'],
  },
  'five-a-day': {
    tabs: ['general', 'unit', 'thresholds'],
  },
};
