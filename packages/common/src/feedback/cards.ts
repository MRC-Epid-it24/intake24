import type { LocaleTranslation, RequiredLocaleTranslation } from '../types';
import type { Character } from './characters';

export type FoodGroupThreshold = {
  threshold: number;
  message: LocaleTranslation;
};

export type CustomCard = {
  id: string;
  name: RequiredLocaleTranslation;
  description: LocaleTranslation;
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
