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

  intake: {
    your: 'Your {nutrient} intake is {amount}.',
    estimated: 'Estimated intake',
    optimal: 'Optimal intake',
    tellMeMore: 'Tell me more',
  },

  unitDescription: {
    percentage_of_energy:
      'Feedback is based on the contribution of the corresponding nutrient to your energy intake.',
    energy_divided_by_bmr:
      'Feedback is based on your energy intake divided by BMR fitting into optimal intake.',
    per_unit_of_weight:
      'Feedback is based on your consumption of the corresponding nutrient per Kg of your weight fitting into optimal intake.',
    range:
      'Feedback is based on your consumption of the corresponding nutrient fitting into optimal intake.',
  },
};

export default feedback;
