import { Character } from './characters';
import { LocaleTranslation, RequiredLocaleTranslation } from '../types';

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
};

export interface NutrientGroup extends CustomCard {
  type: 'nutrient-group';
  nutrientTypes: string[];
}

export interface FiveADay extends CustomCard {
  type: 'five-a-day';
}

export type Card = Character | NutrientGroup | FiveADay;

// Type for validator
export type Cards = Cards[];

export type CardType = Card['type'];
