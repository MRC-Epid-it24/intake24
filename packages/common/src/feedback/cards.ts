import type { LocaleTranslation, RequiredLocaleTranslation } from '../types';
import type { Character } from './characters';

export type FoodGroupThreshold = {
  threshold: number;
  message: LocaleTranslation;
};

export type CustomCard = {
  id: string;
  name: RequiredLocaleTranslation;
  summary: LocaleTranslation;
  description: LocaleTranslation;
  color: string;
  high: FoodGroupThreshold | null;
  low: FoodGroupThreshold | null;
  unit: {
    name: RequiredLocaleTranslation;
    description: LocaleTranslation;
  };
  showRecommendations: boolean;
};

export interface NutrientGroupCard extends CustomCard {
  type: 'nutrient-group';
  nutrientTypes: string[];
}

export interface FiveADayCard extends CustomCard {
  type: 'five-a-day';
}

export type Card = Character | NutrientGroupCard | FiveADayCard;

// Type for validator
export type Cards = Cards[];

export type CardType = Card['type'];

export const cardDefaults: Card[] = [
  {
    id: 'character',
    type: 'character',
    characterType: 'battery',
    nutrientTypeIds: ['1'],
    color: '#FFFFFFFF',
    showRecommendations: false,
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        name: { en: 'Your battery needs a boost' },
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        name: { en: 'Your battery needs a boost' },
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        name: { en: "Your're so energetic" },
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        name: { en: 'Energy overload' },
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        name: { en: 'Energy overload' },
      },
    ],
  },
  {
    id: 'nutrient-group',
    type: 'nutrient-group',
    name: { en: 'Nutrient food group' },
    summary: { en: '' },
    description: { en: '' },
    low: {
      threshold: 0,
      message: { en: '' },
    },
    high: {
      threshold: 0,
      message: { en: '' },
    },
    unit: {
      name: { en: '' },
      description: { en: '' },
    },
    nutrientTypes: [],
    color: '#FFFFFFFF',
    showRecommendations: false,
  },
  {
    id: 'five-a-day',
    type: 'five-a-day',
    name: { en: 'Five a day feedback' },
    summary: { en: '' },
    description: { en: '' },
    low: {
      threshold: 0,
      message: { en: '' },
    },
    high: {
      threshold: 0,
      message: { en: '' },
    },
    unit: {
      name: { en: '' },
      description: { en: '' },
    },
    color: '#FFFFFFFF',
    showRecommendations: false,
  },
];
