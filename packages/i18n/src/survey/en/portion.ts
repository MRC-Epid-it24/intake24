import type { LocaleMessageObject } from 'vue-i18n';

const portion: LocaleMessageObject = {
  quantity: {
    whole: 'Whole',
    fraction: 'Fraction',
    and: 'and',
    confirm: 'I had that many',
  },
  option: {
    text: 'How would you like to estimate the portion size of your {food}?',
    validation: {
      required: 'Please select how the portion will be measured.',
    },
    imageInvalid: 'Image loading',
    description: {
      grated: 'Grated',
      in_a_bag: 'In a bag',
      in_a_bottle: 'In a bottle',
      in_a_bowl: 'In a bowl',
      in_a_can: 'In a can',
      in_a_carton: 'In a carton',
      in_a_glass: 'In a glass',
      in_a_mug: 'In a mug',
      in_a_pot: 'In a pot',
      in_a_takeaway_cup: 'In a takeaway cup',
      in_baby_carrots: 'In baby carrots',
      in_bars: 'In bars',
      in_batons: 'In batons',
      in_berries: 'In berries',
      in_burgers: 'In burgers',
      in_chopped_fruit: 'In chopped fruit',
      in_crinkle_cut_chips: 'In crinkle cut chips',
      in_cubes: 'In cubes',
      in_curly_fries: 'In curly fries',
      in_dollops: 'In dollops',
      in_french_fries: 'In French fries',
      in_individual_cakes: 'In individual cakes',
      in_individual_packs: 'In individual packs',
      in_individual_puddings: 'In individual puddings',
      in_individual_sweets: 'In individual sweets',
      in_slices: 'In slices',
      in_spoonfuls: 'In spoonfuls',
      in_straight_cut_chips: 'In straight cut chips',
      in_thick_cut_chips: 'In thick cut chips',
      in_unwrapped_bars: 'In unwrapped bars',
      in_whole_fruit_vegetables: 'In whole fruit / vegetables',
      in_wrapped_bars: 'In wrapped bars',
      on_a_knife: 'On a knife',
      on_a_plate: 'On a plate',
      slice_from_a_large_cake: 'Slice from a large cake',
      slice_from_a_large_pudding: 'Slice from a large pudding',
      spread_on_a_cracker: 'Spread on a cracker',
      spread_on_a_scone: 'Spread on a scone',
      spread_on_bread: 'Spread on bread',
      use_a_standard_measure: 'Standard measure',
      use_a_standard_portion: 'Standard portion',
      use_an_image: 'Use an image',
      use_these_crisps_in_a_bag: 'Use these crisps in a bag',
      use_tortilla_chips_in_a_bowl: 'Use tortilla chips in a bowl',
      weight: 'Enter weight/volume',
    },
  },
  'as-served': {
    text: 'Using the prompts below, select how much {food} you had, and whether you had leftovers.',
    serving: {
      header: 'Step 1. Select your portion size.',
      label: 'Using these pictures, please choose how much {food} you had.',
      less: 'I had less',
      more: 'I had more',
      confirm: 'I had that much',
    },
    leftovers: {
      header: 'Step 2. Select your leftover size.',
      question: 'Did you leave some of your {food}?',
      label: 'Using these pictures, please choose how much {food} you left.',
      less: 'I left less',
      more: 'I left more',
      confirm: 'I left that much',
    },
    weightFactor: {
      serving: {
        more: 'I had {whole} and {fraction}',
        less: 'I had {fraction}',
      },
      leftovers: {
        more: 'I left {whole} and {fraction}',
        less: 'I left {fraction}',
      },
      // and: 'and',
      less: 'of the smallest portion',
      more: 'of the largest portion',
      weight: '({amount}g)',
    },
  },
  cereal: {
    text: '{food}',
    container: 'Please select the bowl that looks most like the one you used for your {food}.',
  },
  'drink-scale': {
    text: '{food}',
    container:
      'Please select the cup or glass that looks most like the one you used for your {food}.',
    serving: {
      header: 'Step 1. Select your portion size.',
      label:
        'Please use the slider on the right or click on the cup or glass to indicate how full your cup or glass was.',
      hint: 'Slide this to indicate how full your cup or glass was.',
      less: 'It was less full',
      more: 'It was more full',
      confirm: 'It was that full',
    },
    leftovers: {
      header: 'Step 2. Select your leftover size.',
      question: 'Did you leave some of your {food}?',
      label: 'Please use the slider on the right to choose how much you had left.',
      less: 'I left less',
      more: 'I left more',
      confirm: 'I left that much',
    },
  },
  'guide-image': {
    text: '{food}',
    label: 'Please select the item you had or the closest match to {food}.',
    quantity: 'Please choose how many of {food} you had.',
    confirm: 'I had that many',
    expand: 'Expand Image',
  },
  'milk-in-a-hot-drink': {
    text: 'How much {food} did you have in your tea or coffee?',
    label: 'Select the amount you had.',
    confirm: 'I had that much',
  },
  'milk-on-cereal': {
    text: '{food}',
    container: 'Please select the bowl that looks most like the one you used for your {food}.',
    milk: 'Please choose the level your milk came up to (without cereal).',
  },
  pizza: {
    text: '{food}',
    typeLabel: 'Please select the pizza that is closest to the size you had.',
    thicknessLabel: 'How thick was your pizza?',
    sizeLabel: 'What size slice(s) did you have?',
    whole: {
      label: 'How many of these pizzas did you have?',
      confirm: 'I had the whole pizza',
    },
    slices: {
      label: 'How many of these slices did you have?',
    },
    confirm: 'I had that many',
  },
  'standard-portion': {
    text: '{food}',
    label: 'How would you like to estimate the portion size of your {food}?',
    estimateIn: 'In {unit}',
    howMany: {
      _: '{unit} did you have?',
      placeholder: 'How many did you have?',
      withFood: '{unit} of {food} did you have?',
    },
    confirm: 'I had that many',
  },
  unknown: {
    text: 'There is currently no portion size estimation method for {food}.',
  },
  weight: {
    text: 'Please enter how much you had.',
  },
};

export default portion;
