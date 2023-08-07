import type { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkboxList: {
    name: 'Multi-choice list',
    text: '',
    description: '',
    label: 'Select any of the options',
    other: 'Other - please specify',
    validation: {
      required: 'At least one of the options requires to be selected.',
    },
  },
  datePicker: {
    name: 'Select date',
    text: '',
    description: '',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  info: {
    name: 'Info / confirmation',
    text: '',
    description: '',
  },
  noMoreInformation: {
    name: 'No more information needed',
    text: '',
    description: `<p>We have all the information that we need regarding your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click the "Continue" button below and we will automatically select the next food or meal that we still need some information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
  },
  radioList: {
    name: 'Single-choice list',
    text: '',
    description: '',
    label: 'Select one of the options',
    other: 'Other - please specify',
    validation: {
      required: 'One of the options requires to be selected.',
    },
  },
  textarea: {
    name: 'Free text',
    text: '',
    description: '',
    label: 'Enter your answer in textarea',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  timePicker: {
    name: 'Select time',
    text: '',
    description: '',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  yesNo: {
    name: 'Yes / No confirmation',
    text: '',
    description: '',
  },
  // Standard
  associatedFoods: {
    name: 'Associated foods',
    text: '',
    description: '',
    yes: 'Yes, I had some',
    no: 'No, I did not',
    alreadyEntered: 'Yes, already entered',
    select: {
      different: 'Select a different food',
      item: 'Select the food you had',
    },
    missing: {
      label: `I can't find my food`,
      description: `<p>Please try browsing the food categories listed above to find your food.</p>
      <p>Or click 'Browse all foods' and explore the food categories.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
  },
  editMeal: {
    name: 'Edit Meal',
    text: '',
    description: `<p>List everything you had for your <strong>{meal}</strong>, one item per line.</p>
      For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>
      <p>You can press Enter on your keyboard or the "add a food/drink" button to go to the next line as you type.</p>
      <p><strong>Do not</strong> enter how much you had, just the food names.`,
    add: 'Add',
    drinksOnly: 'Drinks',
    foods: 'Foods and drinks',
    foodsOnly: 'Foods',
  },
  final: {
    name: 'Final page',
    text: '',
    description: '',
  },
  foodBrowser: {
    browse: 'Browse all foods',
    search: 'Search for a food',
    none: 'No food results. Please try refining your search.',
    back: `Back to '{category}'`,
  },
  foodSearch: {
    name: 'Search Food',
    text: '',
    description: `<p>Below is the list of foods from our database that look like "<strong>{food}</strong>".</p>
      <p>Choose the item you had or the closest match.</p>`,
    empty: 'There is nothing in our database that matches "{searchTerm}".',
    reword: 'Try re-wording your description.',
    browse: 'Browse all foods',
    missing: {
      label: `I can't find my food`,
      description: `<p>If you can't find your food in the list, try rephrasing your description in the search text box above and click 'search again'.</p>
      <p>Or click 'Browse all foods' and explore the food categories.</p>
      <p>If you still can't find your food, click 'Report a missing food'.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
    confirmDiscardFood: {
      label: 'Yes',
      messageUnsafe: `<p>You have already answered some questions about <strong>"{discardedFoodName}"</strong>!</p>
                <p>If you change it to <strong>"{selectedFoodName}"</strong> now, you might have to answer some of those questions again.</p>
                          <p>Are you sure you would like to replace this food?</p>`,
      message:
        'You have already answered some questions about "{discardedFoodName}"! If you change it to "{selectedFoodName}" now, you might have to answer some of those questions again. Are you sure you would like to replace this food?',
    },
  },
  mealAdd: {
    _: 'Add meal',
    name: 'Add Meal',
    text: '',
    description: '<p>Select one from the list below if it is appropriate.</p>',
    label: 'Select predefined meal',
    custom: {
      text: '',
      description:
        '<p>Enter the name of this meal. You can either type your own name, or select one from the list below if it is appropriate.</p>',
      label: 'Select predefined or enter meal name',
    },
    yes: 'Add this meal',
    no: 'Cancel',
    noMeal: 'No Meals remaining, add at least one',
  },
  mealDuration: {
    name: 'Meal duration',
    text: '',
    description: '<p>How long did it take you to eat <strong>{mealName}</strong>?</p>',
    confirm: 'Continue',
  },
  mealGap: {
    name: 'Meal gap',
    text: '',
    description: '',
    before:
      '<p>Did you have any meals, snacks or drinks before your <strong>{meal}</strong> at {mealTime}?</p>',
    after:
      '<p>Did you have any meals, snacks or drinks after your <strong>{meal}</strong> at {mealTime}?</p>',
    between:
      '<p>Did you have any meals, snacks or drinks between your <strong>{startMeal}</strong> (at {startMealTime}) and your <strong>{endMeal}</strong> (at {endMealTime})?</p>',
    yes: 'Yes, add a meal',
    no: 'No, I did not',
  },
  mealTime: {
    name: 'Edit Time',
    text: '',
    description: '<p>Did you have <strong>{meal}</strong>? If so, what time was this?</p>',
    yes: 'Around that time',
    no: 'Did not have',
  },
  readyMeal: {
    name: 'Ready meal',
    text: '',
    description: `<p>Was this a ready-made meal or food?</p>
      <p>Tick the box if any of these were a ready-made meal or food (e.g. ready to cook / eat / pre-packed).</p>`,
  },
  redirect: {
    name: 'Redirect',
    text: '',
    description: '',
    missingUrl: 'Missing redirection URL',
    goTo: 'Go to the questionnaire',
  },
  reviewConfirm: {
    name: 'Review and Confirm',
    text: '',
    description: '',
  },
  sameAsBefore: {
    name: 'Same as before',
    text: '',
    description: '<p>Was this <strong>{food}</strong> the same as the one you had before?</p>',
    serving: '{amount} serving size',
    leftovers: 'Left about {amount}',
    noLeftovers: {
      drink: 'Drank it all',
      food: 'Ate everything',
    },
    hadWith: 'Had it with:',
    noAddedFoods: 'Nothing added (e.g. milk, sugar, sauces)',
    same: 'Yes, I had the same',
    notSame: 'No, I had a different one',
  },
  splitFood: {
    name: 'Split food',
    text: '',
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
    text: '',
    description: '',
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
    text: '',
    description: 'How do you want to estimate your portion?',
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
      milk_on_cereal: 'Milk on cereal',
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
    text: '',
    description: '',
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
    text: '',
    description: '',
    container: 'Select the bowl that looks most like the one you used for your {food}.',
  },
  drinkScale: {
    name: 'Drink scale',
    text: '',
    description: '',
    container: 'Select the cup or glass that looks most like the one you used for your {food}.',
    serving: {
      header:
        'Use the slider on the right or click on the cup or glass to indicate how full your cup or glass was.',
      hint: 'Slide this to indicate how full your cup or glass was.',
      less: 'I had less',
      more: 'I had more',
      confirm: 'I had that much',
    },
    leftovers: {
      header: 'Did you leave some of your {food}?',
      label: 'Use the slider on the right to choose how much you had left.',
      less: 'I left less',
      more: 'I left more',
      confirm: 'I left that much',
    },
    count: 'How many of these drinks did you have at this time?',
  },
  guideImage: {
    name: 'Guide image',
    text: '',
    description: '',
    label: 'Select the image that is the closest match to the size of {food} you had.',
    quantity: 'Choose how many of {food} you had.',
    confirm: 'I had that many',
    expand: 'Expand Image',
  },
  milkInAHotDrink: {
    name: 'Milk in a hot drink',
    text: '',
    description: '',
    label: 'How much {food} did you have in your tea or coffee?',
    confirm: 'I had that much',
  },
  milkOnCereal: {
    name: 'Milk on cereal',
    text: '',
    description: '',
    container: 'Select the bowl that looks most like the one you used for your {food}.',
    milk: 'Choose the level your milk came up to (without cereal).',
  },
  missingFood: {
    name: 'Missing food',
    text: '',
    description: `You said you were unable to find a good match for "{food}". Please provide as much detail as you can to the following questions, to help us identify your food or drink.`,
    source: 'Was it homemade?',
    homemade: 'Provide further details e.g. description of dish or ingredients.',
    purchased: 'Tell us where was it purchased from? Does it have a brand name?',
    barcode: 'Can you provide the barcode?',
    portionSize: 'How much did you eat? E.g. 1 pack, 2 teaspoons, 1 handful, 125 grams, ½ cup etc.',
  },
  parentFoodPortion: {
    name: 'Parent food portion',
    text: '',
    description: '',
    label: 'How much {food} did you have in your {parentFood}?',
    confirm: 'I had that much',
  },
  pizza: {
    name: 'Pizza',
    text: '',
    description: '',
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
    text: '',
    description: '',
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
    text: '',
    description: 'There is currently no portion size estimation method for {food}.',
  },
  weight: {
    name: 'Weight',
    text: '',
    description: 'Enter how much you had.',
  },
};

export default prompts;
