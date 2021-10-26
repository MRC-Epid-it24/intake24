import { LocaleMessage } from 'vue-i18n';

const portion: LocaleMessage = {
  common: {
    backStep: 'Go back to previous step',
    completeBelow: 'Please complete each of the sections below',
    lessButton: 'I had less',
    moreButton: 'I had more',
    // Maybe don't need both of these as semanitcally very similar
    confirmButtonMany: 'I had that many',
    confirmButton: 'I had that much',
    quantityAnd: 'and', // E.g 1 and 3/4 bananas
  },
  option: {
    // Implementation of this needs looking at for RTL, as localDescription appears at end of line for label
    label: 'How would you like to estimate the portion size of your {food}?',
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
      use_a_standard_measure: 'Use a standard measure',
      use_a_standard_portion: 'Use a standard portion',
      use_an_image: 'Use an image',
      use_these_crisps_in_a_bag: 'Use these crisps in a bag',
      use_tortilla_chips_in_a_bowl: 'Use tortilla chips in a bowl',
      weight: 'Enter weight/volume',
    },
  },
  asServed: {
    promptLabel:
      'Using the prompts below, select how much {food} you had, and whether you had leftovers.',
    portionHeader: 'Step 1. Select your portion size.',
    portionLabel: 'Using these pictures, please choose how much {food} you had.',
    leftoverHeader: 'Step 2. Select your leftover size.',
    leftoverQuestion: 'Did you leave some of your {food}?',
    leftoverLabel: 'Using these pictures, please choose how much {food} you left.',
  },
  guideImage: {
    label: 'Please select the item you had or the closest match.',
    quantity: 'Please chose how many of those you had.',
    validation: {
      required: 'Please select the item you had or the closest match from the image.',
    },
  },
  drinkScale: {
    label: 'Please select the cup or glass that looks most like the one you used for your {food}',
    sliderLabel:
      'Please use the slider on the right or click on the cup or glass to indicate how full your cup or glass was.',
    leftoverLabel: 'Please use the slider on the right to choose how much you had left',
    lessFullButton: 'It was less full',
    moreFullButton: 'It was more full',
    confirmFullButton: 'It was that full',
    sliderHint: 'Slide this to indicate how full your cup or glass was.',
  },
  standardPortion: {
    portionMethodLabel: 'How would you like to estimate your portion size?',
    label: 'How many did you have?',
    optionLabel: 'In {unit}', // E.g. In punnets, berries
    validation: {
      required: 'Please select an option from the list',
    },
  },
  cereal: {
    label: 'Please select the bowl that looks most like the one you used.',
  },
  milkCereal: {
    label: 'Milk with your cereal',
    question: 'Did you have milk on your cereal?',
    foodSelectButton: `I can't find my food`,
  },
  pizza: {
    label: 'Please select the pizza that is closest to the size you had.',
    thicknessLabel: 'How thick was your pizza?',
    sizeLabel: 'What size slice(s) did you have?',
    wholePizzaButton: 'I had the whole pizza',
    slicesLabel: 'How many of these slices did you have?',
  },
  milkHotDrink: {
    label: 'How much {food} did you have in your tea or coffee?',
  },
  directWeight: {
    label: 'Please enter how much you had.',
  },
};

export default portion;
