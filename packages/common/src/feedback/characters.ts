import { LocaleTranslation } from '../types';
import { Sentiment } from './shared';

export enum NutrientTypeIdEnum {
  Energy = '1',
  Carbohydrate = '13',
  Protein = '11',
  TotalFat = '49',
  Sugar = '23',
  SatdFat = '50',
  Fibre = '15',
  VitaminA = '120',
  Calcium = '140',
  VitaminC = '129',
  Iron = '143',
  Folate = '134',
  CO2 = '228',
  TotalFreeSugars = '251',
  AOACFibre = '242',
}

export const characterTypes = [
  'battery',
  'bread',
  'candy',
  'salmon',
  // 'sausage',
  'egg',
  'apple',
  'strawberry',
  'burger',
  'fries',
  'milk',
  'iron',
  'folate',
  'co2',
] as const;
export type CharacterType = typeof characterTypes[number];

export const characterSentimentTypes = ['danger', 'warning', 'happy', 'exciting'] as const;
export type CharacterSentimentType = typeof characterSentimentTypes[number];

export type CharacterSentiment = {
  sentiment: Sentiment[];
  sentimentType: CharacterSentimentType;
  name: LocaleTranslation;
};

export type Character = {
  id: string;
  type: 'character';
  characterType: CharacterType;
  nutrientTypeIds: string[];
  sentiments: CharacterSentiment[];
  showRecommendations: boolean;
};
