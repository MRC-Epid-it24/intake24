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
  title: string;
};

export type Character = {
  id: string;
  type: 'character';
  characterType: CharacterType;
  nutrientTypeIds: string[];
  sentiments: CharacterSentiment[];
};

/* export const characterBuilders: Character[] = [
  {
    type: 'character',
    characterType: 'battery',
    nutrientTypeIds: [NutrientTypeIdEnum.Energy],
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
    type: 'character',
    characterType: 'bread',
    nutrientTypeIds: [NutrientTypeIdEnum.Carbohydrate],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'You could be more starchy',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'You could be more starchy',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: "You're Super Starchy!",
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Careful on the starch',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Careful on the starch',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'apple',
    nutrientTypeIds: [NutrientTypeIdEnum.Fibre],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Keep your finger on pulses!',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Keep your finger on pulses!',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Fibre-licious!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Keep your finger on pulses!',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Keep your finger on pulses!',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'candy',
    nutrientTypeIds: [NutrientTypeIdEnum.Sugar],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Take care, Sugar',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Take care, Sugar',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: "You're doing well, Sugar",
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Take care, Sugar',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Take care, Sugar',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'salmon',
    nutrientTypeIds: [NutrientTypeIdEnum.VitaminA],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Not quite scoring A* for Vitamin A',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Not quite scoring A* for Vitamin A',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Scoring A* for Vitamin A',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Too fishy',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'milk',
    nutrientTypeIds: [NutrientTypeIdEnum.Calcium],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Your milk could be spoiled',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Your milk could be spoiled',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Say cheese!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Your milk could be spoiled',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Your milk could be spoiled',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'burger',
    nutrientTypeIds: [NutrientTypeIdEnum.SatdFat],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: "Please don't eat me!",
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: "Please don't eat me!",
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Such a rate!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: "Please don't eat me!",
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: "Please don't eat me!",
      },
    ],
  },

  {
    type: 'character',
    characterType: 'fries',
    nutrientTypeIds: [NutrientTypeIdEnum.TotalFat],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Chip is feeling fried',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Chip is feeling fried',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Chip is feeling delicious!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Chip is feeling fried',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Chip is feeling fried',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'egg',
    nutrientTypeIds: [NutrientTypeIdEnum.Protein],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Pump up that protein!',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Pump up that protein!',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Feels Egg-static!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Whey too much protein!',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Whey too much protein!',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'strawberry',
    nutrientTypeIds: [NutrientTypeIdEnum.VitaminC],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: 'Stranded in the Vitamin Sea',
      },
      {
        sentiment: ['bit_low'],
        sentimentType: 'warning',
        title: 'Stranded in the Vitamin Sea',
      },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: 'Sí Señor(ita)!',
      },
      {
        sentiment: ['bit_high'],
        sentimentType: 'warning',
        title: 'Too deep in the Vitamin Sea',
      },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: 'Too deep in the Vitamin Sea',
      },
    ],
  },

  {
    type: 'character',
    characterType: 'iron',
    nutrientTypeIds: [NutrientTypeIdEnum.Iron],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: '',
      },
      { sentiment: ['bit_low'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: '',
      },
      { sentiment: ['bit_high'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: '',
      },
    ],
    displayInFeedbackStyle: 'default',
  },

  {
    type: 'character',
    characterType: 'folate',
    nutrientTypeIds: [NutrientTypeIdEnum.Folate],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: '',
      },
      { sentiment: ['bit_low'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: '',
      },
      { sentiment: ['bit_high'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: '',
      },
    ],
    displayInFeedbackStyle: 'default',
  },

  {
    type: 'character',
    characterType: 'candy',
    nutrientTypeIds: [NutrientTypeIdEnum.TotalFreeSugars],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: '',
      },
      { sentiment: ['bit_low'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: '',
      },
      { sentiment: ['bit_high'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: '',
      },
    ],
    displayInFeedbackStyle: 'default',
  },

  {
    type: 'character',
    characterType: 'apple',
    nutrientTypeIds: [NutrientTypeIdEnum.AOACFibre],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: '',
      },
      { sentiment: ['bit_low'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: '',
      },
      { sentiment: ['bit_high'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: '',
      },
    ],
    displayInFeedbackStyle: 'default',
  },

  {
    type: 'character',
    characterType: 'co2',
    nutrientTypeIds: [NutrientTypeIdEnum.CO2],
    sentiments: [
      {
        sentiment: ['too_low', 'low'],
        sentimentType: 'danger',
        title: '',
      },
      { sentiment: ['bit_low'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['good', 'excellent'],
        sentimentType: 'exciting',
        title: '',
      },
      { sentiment: ['bit_high'], sentimentType: 'warning', title: '' },
      {
        sentiment: ['high', 'too_high'],
        sentimentType: 'danger',
        title: '',
      },
    ],
    displayInFeedbackStyle: 'default',
  },
]; */
