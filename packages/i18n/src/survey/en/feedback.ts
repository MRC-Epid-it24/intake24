import { LocaleMessageObject } from 'vue-i18n';

const feedback: LocaleMessageObject = {
  _: 'Feedback',

  physicalData: {
    title: 'About you',
    subtitle: 'We only need few details about you',
    change: 'Change my info',
    recall: 'Record another day',
    summary: 'Summary of your diet',
    sexes: {
      _: 'Sex',
      m: 'Male',
      f: 'Female',
    },
    birthdate: 'Year of birth',
    height: 'Height: {height} cm',
    heightCm: 'Height in centimeters',
    weight: 'Weight: {weight} kg',
    weightKg: 'Weight in kilograms',
    physicalActivityLevelId: 'Physical Activity Level',
    weightTarget: 'Target: {target}',
    weightTargets: {
      _: 'Weight target',
      title: 'Weight targets',
      keep_weight: 'Keep weight',
      lose_weight: 'Lose weight',
      gain_weight: 'Gain weight',
    },
  },
};

export default feedback;
