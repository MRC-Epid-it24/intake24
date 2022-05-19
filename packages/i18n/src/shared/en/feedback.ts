import { LocaleMessageObject } from 'vue-i18n';

const feedback: LocaleMessageObject = {
  _: 'Intake24 feedback',
  title: 'Results from your Intake24 recalls',
  missingFoods:
    'Please note, any foods you reported as missing will not be included in your dietary feedback',

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
      title: 'Download feedback as PDF',
      subtitle:
        'Download a copy of your feedback as PDF file. It will take a couple of seconds, bear with us.',
      send: 'Submit request',
      sent: 'Feedback PDF file has been saved.',
    },
    email: {
      _: 'Email',
      title: 'Send feedback to email',
      send: 'Submit request',
      sent: 'We have sent your feedback to provided email address.',
    },
    retry: 'Feedback output has been recently requested, please try again in {secs} s.',
    print: 'Print',
  },

  submissions: {
    _: 'Submission',
    title: 'Submissions',
  },

  topFoods: {
    title: 'Foods contributing most to selected nutrient intakes',
    chart: 'Highest in {nutrient}',
  },

  intake: {
    your: 'Your {nutrient} intake is {amount}.',
    estimated: 'Estimated intake',
    recommended: 'Recommended intake',
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
