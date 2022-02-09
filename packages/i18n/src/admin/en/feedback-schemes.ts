import { LocaleMessageObject } from 'vue-i18n';

const feedbackSchemes: LocaleMessageObject = {
  _: 'Feedback scheme',
  title: 'Feedback schemes',
  read: 'Feedback scheme detail',
  create: 'Add feedback scheme',
  edit: 'Edit feedback scheme',
  delete: 'Delete feedback scheme',
  none: 'No feedback scheme found',

  name: 'Name',

  copy: {
    _: 'Copy',
    title: 'Copy feedback scheme',
    name: 'New feedback scheme name',
  },

  age: {
    _: 'Age',
    range: 'Age range interval',
    start: 'Age range start',
    end: 'Age range end',
  },

  sexes: {
    _: 'Sex',
    m: 'Male',
    f: 'Female',
  },

  types: {
    _: 'Feedback type',
    title: 'Feedback types',
    default: 'Default',
    playful: 'Playful',
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
        unique: 'Nutrient type already exists in current list.',
      },
    },
  },

  cards: {
    _: 'Card',
    title: 'Cards',
    tab: 'Cards',
    create: 'New card',
    edit: 'Edit card',
    remove: 'Remove card',
    type: 'Card type',
    name: 'Card name',
    required: 'Card name is required.',
    description: 'Description',

    character: {
      title: 'Character',
      subtitle: 'Character / Nutrient card',
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
  },

  'demographic-groups': {
    _: 'Demographic group',
    title: 'Demographic groups',
    tab: 'Demographic groups',
    create: 'New demographic group',
    edit: 'Edit demographic group',
    remove: 'Remove demographic group',
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
};

export default feedbackSchemes;
