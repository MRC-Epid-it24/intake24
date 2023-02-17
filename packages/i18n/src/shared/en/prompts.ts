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
    text: '{item}',
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
    label: 'Enter your answer in textarea',
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
    text: '{food}',
    // description: 'Placeholder',
    yes: 'Yes, I had some',
    no: 'No, I did not',
    alreadyEntered: 'Yes, already entered',
    select: {
      different: 'Select a different food',
      item: 'Select the food you had',
    },
  },
  editMeal: {
    name: 'Edit Meal',
    text: '{meal}',
    description: `<p>List everything you had for your <strong>{meal}</strong>, one item per line.</p>
      For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>
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
    text: '{food}',
    description: `<p>Below is the list of foods from our database that look like "<strong>{food}</strong>".</p>
      <p>Choose the item you had or the closest match.</p>`,
    empty: 'There is nothing in our database that matches "{searchTerm}".',
    reword: 'Try re-wording your description.',
    browse: 'Browse all foods',
    missing: `I can't find my food`,
  },
  mealAdd: {
    _: 'Add meal',
    name: 'Add Meal',
    // text: 'Placeholder',
    description: '<p>Select one from the list below if it is appropriate.</p>',
    label: 'Select predefined meal',
    custom: {
      // text: 'Placeholder',
      description:
        '<p>Enter the name of this meal. You can either type your own name, or select one from the list below if it is appropriate.</p>',
      label: 'Select predefined or enter meal name',
    },
    yes: 'Add this meal',
    no: 'Cancel',
    noMeal: 'No Meals remaining, add at least one',
  },
  mealTime: {
    name: 'Edit Time',
    text: '{meal}',
    description: '<p>Did you have <strong>{meal}</strong>? If so, what time was this?</p>',
    yes: 'Around that time',
    no: 'I did not have {meal}',
    validation: {
      required: 'Select time you had the meal.',
    },
  },
  readyMeal: {
    name: 'Ready meal',
    text: '{meal}',
    description: `<p>Was this a ready-made meal or food?</p>
      <p>Tick the box if any of these were a ready-made meal or food (e.g. ready to cook / eat / pre-packed).</p>`,
  },
  redirect: {
    name: 'Redirect',
  },
  reviewConfirm: {
    name: 'Review and Confirm',
  },
  sameAsBefore: {
    name: 'Same as before',
    text: '{food}',
  },
  splitFood: {
    name: 'Split food',
    text: '{food}',
    description: 'It looks like you entered more than one food item on the line.',
    searchTerm: 'Search term: {food}',
    split: 'Are these separate foods?',
    singleSuggestion:
      'Click on "keep as single food" if you meant a single food such as chicken and vegetable soup.',
    singleSuggestionEx: 'Click on "keep as single food" if you meant a single food such as {food}.',
    separateSuggestion: 'Click on "separate foods" for items such as fish and chips.',
    separateSuggestionEx: 'Click on "separate foods" for items such as {food}.',
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
    text: '{food}',
    description: 'How would you like to estimate the portion size of your <strong>{food}</strong>?',
    selections: {
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
  linkedAmount: {
    label: `{unit} (out of {quantity}) did you have {food} on?`,
    unit: 'How many slices',
    all: 'On all of them',
  },
  asServed: {
    name: 'As served',
    text: '{food}',
    // description: 'Using the prompts below, select how much {food} you had, and whether you had leftovers.',
    serving: {
      header: 'Using these pictures, choose how much {food} you had.',
      less: 'I had less',
      more: 'I had more',
      confirm: 'I had that much',
    },
    leftovers: {
      header: 'Did you leave some of your {food}?',
      label: 'Using these pictures, choose how much {food} you left.',
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
    },
  },
  cereal: {
    name: 'Cereal',
    text: '{food}',
    // description: 'Placeholder',
    container: 'Select the bowl that looks most like the one you used for your {food}.',
  },
  drinkScale: {
    name: 'Drink scale',
    text: '{food}',
    // description: 'Placeholder',
    container: 'Select the cup or glass that looks most like the one you used for your {food}.',
    serving: {
      header:
        'Use the slider on the right or click on the cup or glass to indicate how full your cup or glass was.',
      hint: 'Slide this to indicate how full your cup or glass was.',
      less: 'It was less full',
      more: 'It was more full',
      confirm: 'It was that full',
    },
    leftovers: {
      header: 'Did you leave some of your {food}?',
      label: 'Use the slider on the right to choose how much you had left.',
      less: 'I left less',
      more: 'I left more',
      confirm: 'I left that much',
    },
  },
  guideImage: {
    name: 'Guide image',
    text: '{food}',
    // description: 'Placeholder',
    label: 'Select the image that is the closest match to the size of {food} you had.',
    quantity: 'Choose how many or how much you had.',
    confirm: 'I had that many',
    expand: 'Expand Image',
  },
  milkInAHotDrink: {
    name: 'Milk in a hot drink',
    text: '{food}',
    // description: 'Placeholder',
    label: 'How much {food} did you have in your tea or coffee?',
    confirm: 'I had that much',
  },
  milkOnCereal: {
    name: 'Milk on cereal',
    text: '{food}',
    // description: 'Placeholder',
    container: 'Select the bowl that looks most like the one you used for your {food}.',
    milk: 'Choose the level your milk came up to (without cereal).',
  },
  missingFood: {
    name: 'Missing food',
    text: '{food}',
    description: `You said you were unable to find a good match for "{food}" in our food database.
      Please answer the following questions to help us identify this food and add it to our food list.`,
    info: {
      name: 'What is the name of the missing food, dish or drink?',
      brand: 'What brand is the missing food, or what shop/store was it purchased from?',
      description:
        'Please provide a description of the missing food or dish. If it was a homemade dish, please specify ingredients and quantities, where possible.',
      portionSize: 'How was the missing food or dish cooked?',
      leftovers:
        'How much of the missing food or dish did you eat, e.g. 2 teaspoons, 1 handful, 125 grams, ½ cup etc?',
    },
  },
  pizza: {
    name: 'Pizza',
    text: '{food}',
    // description: 'Placeholder',
    typeLabel: 'Select the pizza that is closest to the size you had.',
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
    // description: 'Placeholder',
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
    name: 'Unknown',
    text: 'There is currently no portion size estimation method for {food}.',
    // description: 'Placeholder',
  },
  weight: {
    name: 'Weight',
    text: 'Enter how much you had.',
    // description: 'Placeholder',
  },
};

export default prompts;
