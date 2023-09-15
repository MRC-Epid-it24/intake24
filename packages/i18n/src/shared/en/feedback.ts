import type { LocaleMessageObject } from 'vue-i18n';

const feedback: LocaleMessageObject = {
  _: 'Dietary feedback',
  info: 'Dietary feedback information',
  status: {
    available: 'Dietary Feedback is available',
    lowRecalls:
      'Dietary feedback will be available once you submitted at least {minRecalls} recalls.',
    notAvailable: 'Dietary feedback is not available for this survey.',
  },
  title: 'Dietary feedback from {name} recalls',
  missingFoods: 'Any foods reported as missing will not be included in dietary feedback',

  physicalData: {
    title: 'About you',
    subtitle: 'We only need few details about you',
    change: 'Change my info',
    recall: 'Record another day',

    sexes: {
      _: 'Sex',
      m: 'Male',
      f: 'Female',
    },
    sex: 'Sex: {sex}',
    age: 'Age: {age}',
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

  outputs: {
    title: 'Outputs',
    download: {
      _: 'Download',
      title: 'Download as PDF',
      subtitle:
        'Download a copy of your dietary feedback as PDF file. It will take a couple of seconds, bear with us.',
      send: 'Submit request',
      sent: 'Dietary feedback PDF file has been saved.',
    },
    email: {
      _: 'Email',
      title: 'Send to email',
      send: 'Submit request',
      sent: 'We have sent your dietary feedback to provided email address.',
    },
    retry: 'Dietary feedback output has been recently requested, try again in {secs} s.',
    print: 'Print',
  },

  topFoods: {
    title: 'Foods contributing most to your nutrient intakes',
    chart: 'Highest in {nutrient}',
  },

  meals: {
    title: 'Meals per-day breakdown',
    chart: '{nutrient}',
  },

  intake: {
    your: 'Your {nutrient} intake is {amount}',
    estimated: 'Estimated intake',
    recommended: 'Recommended intake',
    tellMeMore: 'Tell me more',
    gotIt: 'Got it!',
  },

  unitDescription: {
    percentage_of_energy:
      'Dietary feedback is based on the contribution of this nutrient to your energy intake and how it compares with recommendations.',
    energy_divided_by_bmr:
      'Dietary feedback is based on your energy intake divided by BMR and how this compares to recommendations.',
    per_unit_of_weight:
      'Dietary feedback is based on your intake of this nutrient per kg of your body weight and how this compares with recommendations.',
    range:
      'Dietary feedback is based on your intake of this nutrient and how it compares with recommendations.',
  },
};

export default feedback;
