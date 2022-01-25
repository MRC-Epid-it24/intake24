import { LocaleMessageObject } from 'vue-i18n';

const feedback: LocaleMessageObject = {
  _: 'Feedback',

  physicalData: {
    title: 'About you',
    subtitle: 'We only need few details about you',
    sexes: {
      _: 'Sex',
      m: 'Male',
      f: 'Female',
    },
    birthdate: 'Year of birth',
    heightCm: 'Height in centimeters',
    weightKg: 'Weight in kilograms',
    physicalActivityLevelId: 'Physical Activity Level',
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
