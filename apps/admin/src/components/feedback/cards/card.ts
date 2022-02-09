import { Card, CardType } from '@intake24/common/feedback';

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

export const cardDefaults: Card[] = [
  {
    id: 'character',
    type: 'character',
    characterType: 'battery',
    nutrientTypeIds: ['1'],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Your battery needs a boost',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Your battery needs a boost',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: "Your're so energetic",
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Energy overload',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Energy overload',
      },
    ],
  },
  {
    id: 'demographic-group',
    type: 'nutrient-group',
    name: { en: 'Nutrient food group' },
    description: { en: null },
    low: {
      threshold: 0,
      message: { en: null },
    },
    high: {
      threshold: 0,
      message: { en: null },
    },
    unit: {
      name: { en: '' },
      description: { en: null },
    },
    nutrientTypes: [],
  },
  {
    id: 'five-a-day',
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
    unit: {
      name: { en: '' },
      description: { en: null },
    },
  },
];
