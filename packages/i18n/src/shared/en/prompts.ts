import type { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkbox: {
    name: 'Multi-choice list',
    label: 'Select any of the options',
    other: 'Please specify',
    validation: {
      required: 'At least one of the options requires to be selected.',
    },
  },
  datepicker: {
    name: 'Select date',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  info: {
    name: 'Info / confirmation',
  },
  noMoreInformation: {
    name: 'No more information needed',
    text: 'No more information needed',
    description: `<p>We have all the information that we need regarding your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click the "Continue" button below and we will automatically select the next food or meal that we still need some information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
  },
  radio: {
    name: 'Single-choice list',
    label: 'Select one of the options',
    other: 'Please specify',
    validation: {
      required: 'One of the options requires to be selected.',
    },
  },
  textarea: {
    name: 'Free text',
    label: 'Please enter your answer in textarea',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  timepicker: {
    name: 'Select time',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  yesNo: {
    name: 'Yes / No confirmation',
  },
  // Standard
  associatedFoods: {
    name: 'Associated foods',
    text: 'Did you have any of these with your {food}?',
    description: 'These foods are often consumed together.',
    yes: 'Yes, I had some',
    no: 'No, I did not',
    alreadyEntered: 'Yes, already entered',
    select: {
      different: 'Select a different food',
      item: 'Please select an item from this category',
    },
  },
  editMeal: {
    name: 'Edit Meal',
    text: 'Please list everything you had for your {meal}, one item per line.',
    description: `For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>
      <p>You can press Enter on your keyboard or the "add a food/drink" button to go to the next line as you type.</p>
      <p><strong>Do not</strong> enter how much you had, just the food names.`,
    food: 'Your food and drinks',
    drinks: 'Drinks',
    addFood: 'Add',
    addDrink: 'Add a drink',
    delete: {
      _: 'Delete {item}',
      confirm: 'Do you want to delete {item}?',
    },
    deleteFoodFromMeal: 'Delete {food}',
    editMeal: 'Edit {meal}',
    editTime: 'Change Time',
  },
  final: {
    name: 'Final page',
  },
  foodSearch: {
    name: 'Search Food',
    text: 'Below is the list of foods from our database that look like "{food}".',
    description: 'Please choose the item you had, or the closest match.',
    empty: 'There is nothing in our database that matches "{searchTerm}".',
    reword: 'Please try re-wording your description.',
  },
  mealAdd: {
    _: 'Add meal',
    name: 'Add Meal',
    text: 'Please enter the name of this meal',
    description:
      'You can either type your own name, or select one from the list below if it is appropriate.',
    label: 'Select predefined or enter meal name',
    yes: 'Add this meal',
    no: 'Cancel',
    hint: 'Hit enter when finished typing',
    noMeal: 'No Meals remaining, please add at least one',
  },
  mealTime: {
    name: 'Edit Time',
    text: 'Did you have {meal}? If so, when was this?',
    // description: 'Placeholder',
    yes: 'Around that time',
    no: 'I did not have {meal}',
    validation: {
      required: 'Please select time you had the meal.',
    },
  },
  readyMeal: {
    name: 'Ready meal',
    text: 'Was this a ready-made meal or food?',
    description:
      'Tick the box if any of these were a ready-made meal or food (e.g. ready to cook / eat / pre-packed).',
  },
  redirect: {
    name: 'Redirect',
  },
  reviewConfirm: {
    name: 'Review and Confirm',
  },
  sameAsBefore: {
    name: 'Same as before',
  },
  splitFood: {
    name: 'Split food',
    text: 'It looks like you entered more than one food item on the line.',
    searchTerm: 'Search term: {food}',
    split: 'Are these separate foods?',
    singleSuggestion:
      'Please click on "keep as single food" if you meant a single food such as chicken and vegetable soup.',
    singleSuggestionEx:
      'Please click on "keep as single food" if you meant a single food such as {food}.',
    separateSuggestion: 'Please click on "separate foods" for items such as fish and chips.',
    separateSuggestionEx: 'Please click on "separate foods" for items such as {food}.',
    separate: 'Separate foods',
    single: 'Keep as single food',
  },
  submit: {
    name: 'Submit page',
  },

  // Portion sizes
  quantity: {
    whole: 'Whole',
    fraction: 'Fraction',
    and: 'and',
    confirm: 'I had that many',
  },
  portionSizeOption: {
    name: 'Portion method',
    text: 'How would you like to estimate the portion size of your {food}?',
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
  linkedAmount: {
    label: `How many slices (out of {quantity}) did you have {food} on?`,
    all: 'On all of them',
  },
  asServed: {
    name: 'As served',
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
    name: 'Cereal',
    text: '{food}',
    container: 'Please select the bowl that looks most like the one you used for your {food}.',
  },
  drinkScale: {
    name: 'Drink scale',
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
  guideImage: {
    name: 'Guide image',
    text: '{food}',
    label: 'Please select the item you had or the closest match to {food}.',
    quantity: 'Please choose how many of {food} you had.',
    confirm: 'I had that many',
    expand: 'Expand Image',
  },
  milkInAHotDrink: {
    name: 'Milk in a hot drink',
    text: 'How much {food} did you have in your tea or coffee?',
    label: 'Select the amount you had.',
    confirm: 'I had that much',
  },
  milkOnCereal: {
    name: 'Milk on cereal',
    text: '{food}',
    container: 'Please select the bowl that looks most like the one you used for your {food}.',
    milk: 'Please choose the level your milk came up to (without cereal).',
  },
  pizza: {
    name: 'Pizza',
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
  standardPortion: {
    name: 'Standard portion',
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
    name: 'Weight',
    text: 'Please enter how much you had.',
  },
};

export default prompts;
