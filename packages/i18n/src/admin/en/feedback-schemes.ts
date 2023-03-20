import type { LocaleMessageObject } from 'vue-i18n';

import securables from './securables';

const feedbackSchemes: LocaleMessageObject = {
  _: 'Feedback scheme',
  title: 'Feedback schemes',
  read: 'Feedback scheme detail',
  create: 'Add feedback scheme',
  edit: 'Edit feedback scheme',
  delete: 'Delete feedback scheme',
  load: 'Load from scheme',
  none: 'No feedback scheme found',

  types: {
    _: 'Feedback type',
    title: 'Feedback types',
    default: 'Default',
    playful: 'Playful',
  },

  outputs: {
    _: 'Output',
    title: 'Outputs',
    print: 'Print',
    email: 'Email',
    download: 'Download',
  },

  physicalDataFields: {
    _: 'Physical data fields',
    title: 'Physical data fields',
    required: `Physical data field {field} is needed to calculate feedback.`,
    notRequired: `Physical data field {field} is not needed, it can be removed.`,
    sex: 'Sex',
    weightKg: 'Weight',
    heightCm: 'Height',
    physicalActivityLevelId: 'Physical activity level',
    birthdate: 'Birth date',
    weightTarget: 'Weight target',
  },

  copy: {
    _: 'Copy',
    title: 'Copy feedback scheme',
    name: 'New feedback scheme name',
  },

  preview: {
    _: 'Preview',
    title: 'Feedback preview',
  },

  ranges: {
    _: 'Range',
    start: 'Start',
    end: 'End',
  },

  age: {
    _: 'Age',
    range: 'Age range interval',
    start: 'Age range start',
    end: 'Age range end',
  },

  height: {
    _: 'Height',
  },

  weight: {
    _: 'Weight',
  },

  sexes: {
    _: 'Sex',
    m: 'Male',
    f: 'Female',
  },

  sentiments: {
    _: 'Sentiment',
    title: 'Sentiments',
    add: 'Add sentiment',
    remove: 'Remove sentiment',
    too_low: 'Too low',
    low: 'Low',
    bit_low: 'Bit low',
    good: 'Good',
    excellent: 'Excellent',
    high: 'High',
    bit_high: 'Bit high',
    too_high: 'Too high',
  },

  characterTypes: {
    _: 'Character type',
    battery: 'Battery',
    bread: 'Bread',
    candy: 'Candy',
    salmon: 'Salmon',
    sausage: 'Sausage',
    egg: 'Egg',
    apple: 'Apple',
    strawberry: 'Strawberry',
    burger: 'Burger',
    fries: 'Fries',
    milk: 'Milk',
    iron: 'Iron',
    folate: 'Folate',
    co2: 'CO2',
  },

  characterSentimentTypes: {
    _: 'Character sentiment type',
    title: 'Character sentiment types',
    danger: 'Danger',
    warning: 'Warning',
    happy: 'Happy',
    exciting: 'Exciting',
  },

  nutrientRuleTypes: {
    _: 'Nutrient rule type',
    title: 'Nutrient rule types',
    energy_divided_by_bmr: 'Energy divided by BMR',
    percentage_of_energy: 'Percentage of energy',
    per_unit_of_weight: 'Per unit of weight',
    range: 'Range',
  },

  physicalActivityLevels: {
    _: 'Physical activity level',
    title: 'Physical activity levels',
  },

  'top-foods': {
    _: 'Top food',
    title: 'Top foods',
    tab: 'Top foods',
    max: {
      _: 'Foods number',
      title: 'Number of foods',
      required: 'Value must be an integer',
    },
    colors: {
      _: 'Color',
      title: 'Color list',
      edit: 'Edit color',
      other: 'Other food',
    },
    nutrientTypes: {
      reset: {
        _: 'Reset nutrient types',
        text: 'Reset nutrient types to default list',
      },
      validation: {
        required: 'Nutrient type must be filled in.',
        unique: 'Nutrient types combination already exists in current list.',
      },
    },
  },

  cards: {
    _: 'Card',
    title: 'Cards',
    tab: 'Cards',
    add: 'Add card',
    edit: 'Edit card',
    remove: 'Remove card',
    type: 'Card type',
    options: 'Card options',
    name: 'Card name',
    required: 'Card name is required.',
    description: 'Description',
    showRecommendations: 'Show feedback recommendations',

    tabs: {
      general: 'General',
      content: 'Content',
      unit: 'Unit',
      thresholds: 'Thresholds',
      nutrients: 'Nutrients',
    },

    character: {
      title: 'Character',
      subtitle: 'Character / Nutrient',
    },
    'nutrient-group': {
      title: 'Nutrient group',
      subtitle: 'Feedback grouping intake based on nutrient list',
    },
    'five-a-day': {
      title: 'Five A Day',
      subtitle: 'Five A Day feedback',
    },

    thresholds: {
      _: 'Threshold',
      title: 'Thresholds',
      low: 'Lower threshold limit',
      high: 'Upper threshold limit',
      enabled: 'Enable threshold',
      message: 'Warning message',
    },

    unit: {
      name: 'Unit name',
      description: 'Unit description',
      required: 'Unit name is required.',
    },
  },

  'demographic-groups': {
    _: 'Demographic group',
    title: 'Demographic groups',
    tab: 'Demographic groups',
    create: 'New demographic group',
    edit: 'Edit demographic group',
    remove: 'Remove demographic group',

    tabs: {
      general: 'General',
      sectors: 'Scale sectors',
    },

    sectors: {
      _: 'Scale sector',
      title: 'Scale sectors',
      add: 'Add scale sector',
      remove: 'Remove scale sector',
    },
  },

  'henry-coefficients': {
    _: 'Henry coefficient',
    title: 'Henry coefficients',
    tab: 'Henry coefficients',
    create: 'New henry coefficient',
    edit: 'Edit henry coefficient',
    remove: 'Remove henry coefficient',

    constant: 'Constant',
    weightCoefficient: 'Weight coefficient',
    heightCoefficient: 'Height coefficient',
  },

  securables,
};

export default feedbackSchemes;
