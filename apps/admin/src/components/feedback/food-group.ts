import { FoodGroup } from '@intake24/common/feedback';

const baseTab = ['general', 'content'];

export type FoodGroupSettingsRecord = {
  tabs: string[];
};

export type FoodGroupType = FoodGroup['type'];

export type FoodGroupSettings = Record<FoodGroupType, FoodGroupSettingsRecord>;

export const foodGroupSettings: FoodGroupSettings = {
  'nutrient-group': {
    tabs: [...baseTab, 'thresholds', 'nutrients'],
  },
  'five-a-day': {
    tabs: [...baseTab, 'thresholds'],
  },
};

export const foodGroupDefaults: FoodGroup[] = [
  {
    type: 'nutrient-group',
    name: { en: 'Nutrient food group' },
    description: { en: null },
    nutrientTypes: [],
    low: {
      threshold: 0,
      message: { en: null },
    },
    high: {
      threshold: 0,
      message: { en: null },
    },
  },
  {
    type: 'five-a-day',
    name: { en: 'Five a day feedback' },
    description: { en: null },
    low: {
      threshold: 0,
      message: { en: null },
    },
    high: {
      threshold: 0,
      message: { en: null },
    },
  },
];
