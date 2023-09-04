import type { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkboxList: {
    name: 'பல தேர்வு பட்டியல்',
    text: '',
    description: '',
    label: '',
    other: 'தயவுசெய்து குறிப்பிடவும்',
    validation: {
      required: 'குறைந்தபட்சம் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்க வேண்டும்.',
    },
  },
  datePicker: {
    text: '',
    description: '',
    name: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    validation: {
      required: 'இந்தப் புலம் நிரப்பப்பட வேண்டும்.',
    },
  },
  info: {
    name: 'தகவல் / உறுதிப்படுத்தல்',
    text: '',
    description: '',
  },
  noMoreInformation: {
    name: 'மேலும் தகவல் தேவையில்லை',
    text: '',
    description: `<p>இந்த நேரத்தில் உங்கள் <strong>{item}</strong> தொடர்பாக எங்களுக்குத் தேவையான அனைத்து தகவல்களும் எங்களிடம் உள்ளன.</p>
        <p>கருத்துக்கணிப்பைத் தொடர, கீழே உள்ள "தொடரவும்" பொத்தானைக் கிளிக் செய்யவும். அடுத்த உணவு அல்லது உணவைத் தானாகத் தேர்ந்தெடுப்போம்.</p>
        <p>மாற்றாக, நீங்கள் ஒரு குறிப்பிட்ட பொருளில் கவனம் செலுத்த விரும்பினால், இடதுபுறத்தில் உள்ள உணவு அல்லது உணவைக் கிளிக் செய்யவும்.</p>`,
  },
  radioList: {
    name: 'ஒற்றைத் தேர்வு பட்டியல்',
    text: '',
    description: '',
    label: '',
    other: 'தயவுசெய்து குறிப்பிடவும்',
    validation: {
      required: 'விருப்பத்தேர்வில் இருந்து ஒன்றைத் தேர்ந்தெடுக்க வேண்டும்.',
    },
  },
  textarea: {
    name: 'இலவச உரை',
    text: '',
    description: '',
    label: 'உரை பகுதியில் உங்கள் பதிலை உள்ளிடவும்',
    validation: {
      required: 'இந்தப் புலம் நிரப்பப்பட வேண்டும்.',
    },
  },
  timePicker: {
    name: 'நேரத்தைத் தேர்ந்தெடுக்கவும்',
    text: '',
    description: '',
    validation: {
      required: 'இந்தப் புலம் நிரப்பப்பட வேண்டும்.',
    },
  },
  yesNo: {
    name: 'ஆம் / இல்லை உறுதிப்படுத்தல் ',
    text: '',
    description: '',
  },
  // Standard
  associatedFoods: {
    name: 'தொடர்புடைய உணவுகள்',
    text: '',
    description: '',
    yes: 'ஆம், என்னிடம் சில இருந்தது',
    yesAnother: 'Yes, I had another',
    no: 'இல்லை நான் செய்யவில்லை',
    moreFoodsQuestion: 'Did you have any other foods from this category?',
    databaseLookupTitle: 'What was it?',
    databaseLookupWithExisting: 'If not, what was it?',
    existingFoodsTitle: 'Was it something you already entered?',
    select: {
      different: 'வேறு உணவைத் தேர்ந்தெடுக்கவும்',
      remove: 'Remove',
    },
    browse: 'Browse all foods',
    search: 'Search for a food',
    root: 'all food categories',
    back: `Back to '{category}'`,
    none: 'No food results. Please try refining your search.',
    missing: {
      label: `I can't find my food`,
      description: `<p>Please try browsing the food categories listed above to find your food.</p>
      <p>Or click 'Browse all foods' and explore the food categories.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
  },
  editMeal: {
    name: 'உணவைத் திருத்தவும்',
    text: '',
    description: `எடுத்துக்காட்டாக:<p><ul><li>வாழைப்பழம்</li><li>கிரிஸ்ப்ஸ்</li><li>அரிசி</li><li>தேநீர்</li></ul></p>
      <p>நீங்கள் தட்டச்சு செய்யும் போது அடுத்த வரிக்குச் செல்ல உங்கள் விசைப்பலகையில் Enter அல்லது "உணவு/பானத்தைச் சேர்" பொத்தானை அழுத்தலாம்.</p>
      <p> உங்களிடம் எவ்வளவு இருந்தது என்பதை உள்ளிட <strong>வேண்டாம்</strong>, உணவுப் பெயர்கள் மட்டுமே.`,
    food: 'உங்கள் உணவு மற்றும் பானங்கள்',
    add: 'Add',
    drinksOnly: 'பானங்கள்',
    foods: 'Foods and drinks',
    foodsOnly: 'Foods',
  },
  final: {
    name: 'இறுதிப் பக்கம்',
    text: '',
    description: '',
  },
  foodSearch: {
    name: 'உணவைத் தேடு',
    text: '',
    description: `<p>Below is the list of foods from our database that look like "<strong>{food}</strong>".</p>
      <p>Choose the item you had or the closest match.</p>`,
    empty: 'எங்கள் தரவுத்தளத்தில் "{searchTerm} உடன் பொருந்தக்கூடிய எதுவும் இல்லை".',
    reword: 'உங்கள் விளக்கத்தை மீண்டும் எழுத முயற்சிக்கவும்.',
    browse: 'Browse all foods',
    search: 'Search for a food',
    root: 'all food categories',
    back: `Back to '{category}'`,
    none: 'No food results. Please try refining your search.',
    missing: {
      label: `I can't find my food`,
      description: `<p>If you can't find your food in the list, try rephrasing your description in the search text box above and click 'search again'.</p>
      <p>Or click 'Browse all foods' and explore the food categories.</p>
      <p>If you still can't find your food, click 'Report a missing food'.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
    recipeBuilder: {
      label: `Add your own {searchTerm} recipe`,
      description: `<p>Build your own recipe.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
      missing: {
        label: `I can't find my food`,
        description: `<p>If you can't find your food in the list, try rephrasing your description in the search text box above and click 'search again'.</p>
        <p>Or click 'Browse all foods' and explore the food categories.</p>
        <p>If you still can't find your food, click 'Report a missing food'.</p>`,
        report: 'Report a missing food',
        tryAgain: 'OK, let me try again',
      },
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
    name: 'சாப்பாடு சேர்க்கவும்',
    text: '',
    description: 'பொருத்தமானதாக இருந்தால் கீழே உள்ள பட்டியலில் இருந்து ஒன்றைத் தேர்ந்தெடுக்கவும்.',
    label: 'முன் வரையறுக்கப்பட்ட உணவைத் தேர்ந்தெடுக்கவும்',
    custom: {
      text: '',
      description:
        '<p>நீங்கள் உங்கள் சொந்த பெயரைத் தட்டச்சு செய்யலாம் அல்லது பொருத்தமானதாக இருந்தால் கீழே உள்ள பட்டியலில் இருந்து ஒன்றைத் தேர்ந்தெடுக்கலாம்.</p>',
      label: 'முன் வரையறுக்கப்பட்டதைத் தேர்ந்தெடுக்கவும் அல்லது உணவின் பெயரை உள்ளிடவும்',
    },
    yes: 'இந்த உணவைச் சேர்க்கவும்',
    no: 'ரத்து செய்',
    noMeal: 'உணவு எதுவும் இல்லை, குறைந்தது ஒன்றைச் சேர்க்கவும்',
  },
  mealDuration: {
    name: 'நேரத்தை திருத்தவும்',
    text: '',
    description: '<p>How long did it take you to eat <strong>{mealName}</strong>?</p>',
    minutes: 'mins',
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
    name: 'தயார் சாப்பாடு',
    text: '',
    description: `<p>Was this a ready-made meal or food?</p>`,
  },
  redirect: {
    name: 'வழிமாற்று',
    text: '',
    description: '',
    missingUrl: 'Missing redirection URL',
    goTo: 'Go to the questionnaire',
  },
  reviewConfirm: {
    name: 'மதிப்பாய்வு செய்து உறுதிப்படுத்தவும்',
    text: '',
    description: '',
  },
  sameAsBefore: {
    name: 'முன்பு போலவே',
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
    name: 'உணவை பிரிக்கவும் ',
    text: '',
    description: 'It looks like you entered more than one food item on the line.',
    searchTerm: 'தேடல் சொல்: {food}',
    split: 'இவை தனி உணவுகளா?',
    singleSuggestion:
      'கோழி மற்றும் காய்கறி சூப் போன்ற ஒற்றை உணவை நீங்கள் குறிப்பிடுகிறீர்கள் என்றால் "ஒற்றை உணவாக வைத்திருங்கள்" என்பதைக் கிளிக் செய்யவும்.',
    singleSuggestionEx:
      'நீங்கள் {food} போன்ற ஒற்றை உணவைக் குறிக்கிறீர்கள் என்றால் "ஒற்றை உணவாக வைத்திருங்கள்" என்பதைக் கிளிக் செய்யவும்.',
    separateSuggestion:
      'மீன் மற்றும் சிப்ஸ் போன்ற பொருட்களுக்கு "தனி உணவுகள்" என்பதைக் கிளிக் செய்யவும்.',
    separateSuggestionEx: '{food} போன்ற பொருட்களுக்கு "தனி உணவுகள்" என்பதைக் கிளிக் செய்யவும்.',
    separate: 'உணவை பிரித்து  படுத்துதவும்',
    single: 'ஒரே உணவாக வைத்துக் கொள்ளா   ',
  },
  submit: {
    name: 'பக்கத்தை சமர்ப்பிக்கவும்',
    text: '',
    description: '',
  },

  // Portion sizes
  quantity: {
    whole: 'முழுமையாக ',
    fraction: 'பின்னம்',
    and: 'மற்றும்',
    confirm: 'நான் நிறைய இருந்தன',
  },
  portionSizeOption: {
    name: 'பகுதி முறை',
    text: '',
    description: 'How do you want to estimate your portion?',
    selections: {
      grated: 'அரைக்கப்பட்டது',
      in_a_bag: 'ஒரு பையில்',
      in_a_bottle: 'ஒரு பாட்டிலில் ',
      in_a_bowl: 'ஒரு கிண்ணத்தில்',
      in_a_can: 'ஒரு கேனில்',
      in_a_carton: 'ஒரு அட்டைப்பெட்டியில்',
      in_a_glass: 'ஒரு கண்ணாடி கோப்பில்',
      in_a_mug: 'ஒரு குவளையில்',
      in_a_pot: 'ஒரு மண்பாண்டத்தில் ',
      in_a_takeaway_cup: 'எடுத்துச்செல்லும் கோப்பையில்',
      in_baby_carrots: 'சிறிய வகை கேரட்டில்',
      in_bars: 'பார்களில்',
      in_batons: 'தடிகளில்',
      in_berries: 'பெர்ரிகளில்',
      in_burgers: 'பர்கர்களில்',
      in_chopped_fruit: 'வெட்டப்பட்ட பழங்களில்',
      in_crinkle_cut_chips: 'கிரிங்கிள் வெட்டு சிப்ஸில்',
      in_cubes: 'சதுர வடிவில் ',
      in_curly_fries: 'சுருள் உருளைக்கிழங்கு பொரியலில்',
      in_dollops: 'திரவமாக ',
      in_french_fries: 'உருளைக்கிழங்கு பொரியலில்',
      in_individual_cakes: 'தனிப்பட்ட கேக்குகளில்',
      in_individual_packs: 'தனிப்பட்ட பொதிகளில்',
      in_individual_puddings: 'தனிப்பட்ட பாகு',
      in_individual_sweets: 'தனிப்பட்ட இனிப்புகளில்',
      in_slices: 'துண்டுகளாக',
      in_spoonfuls: 'கரண்டியில்',
      in_straight_cut_chips: 'நேராக வெட்டப்பட்ட சிப்ஸில்',
      in_thick_cut_chips: 'தடித்த வெட்டு சிப்ஸில்',
      in_unwrapped_bars: 'உறை இடுபடாத பார்களில்',
      in_whole_fruit_vegetables: 'முழு பழங்கள் / காய்கறிகளில்',
      in_wrapped_bars: 'உறை இடுபட்ட பார்களில் ',
      milk_on_cereal: 'Milk on cereal',
      on_a_knife: 'ஒரு கத்தி மீது',
      on_a_plate: 'ஒரு தட்டில்',
      slice_from_a_large_cake: 'ஒரு பெரிய கேக்கில் இருந்து துண்டு',
      slice_from_a_large_pudding: 'ஒரு பெரிய பாகுல் இருந்து துண்டு',
      spread_on_a_cracker: 'ஒரு பிஸ்கட்டில் தடவியதுv',
      spread_on_a_scone: 'ஒரு ஸ்கோனில் தடவியது',
      spread_on_bread: 'ரொட்டியில் தடவியது',
      use_a_standard_measure: 'நிலையான அளவு',
      use_a_standard_portion: 'நிலையான பகுதி',
      use_an_image: 'படத்தைப் பயன்படுத்தவும்',
      use_these_crisps_in_a_bag: 'இந்த கிரிஸ்ப்ஸ்-ஐ ஒரு பையில் பயன்படுத்தவும்',
      use_tortilla_chips_in_a_bowl: 'ஒரு பாத்திரத்தில் டார்ட்டில்லா சிப்ஸைப் பயன்படுத்தவும்',
      weight: 'எடை/தொகுதியை உள்ளிடவும்',
    },
  },
  linkedAmount: {
    label: `எத்தனை துண்டுகள் ({quantity} இல்) நீங்கள் {food} வைத்திருந்தீர்கள்?`,
    unit: 'How many slices',
    all: 'அவை அனைத்தும்',
  },
  asServed: {
    name: 'என பரிமாறப்பட்டது',
    text: '',
    description: '',
    serving: {
      header: 'Using these pictures, choose how much {food} you had.',
      less: 'நான் குறைவாக எடுத்துக்கொண்டேன்  ',
      more: 'நான் அதிகம்  எடுத்துக்கொண்டேன் ',
      confirm: 'அந்த அளவுக்கு எடுத்துக்கொண்டேன் ',
    },
    leftovers: {
      header: 'Did you leave some of your {food}?',
      label:
        'இந்தப் படங்களைப் பயன்படுத்தி, நீங்கள் எவ்வளவு {food} விட்டுவிட்டீர்கள் என்பதைத் தேர்வுசெய்யவும்.',
      less: 'நான் குறைவாக விட்டுவிட்டேன்',
      more: 'நான் அதிகமாக விட்டுவிட்டேன்',
      confirm: 'அந்த அளவுக்கு விட்டுவிட்டேன்h',
    },
    weightFactor: {
      serving: {
        more: 'என்னிடம் {whole} மற்றும் {fraction} இருந்தது',
        less: 'என்னிடம் {fraction} இருந்தது',
      },
      leftovers: {
        more: 'நான் {whole} மற்றும் {fraction} ஐ விட்டுவிட்டேன்',
        less: 'நான் {fraction} ஐ விட்டுவிட்டேன்',
      },
      // and: 'and',
      less: 'மிகச்சிறிய பகுதி',
      more: 'மிகப்பெரிய பகுதிn',
    },
  },
  cereal: {
    name: 'தானியம்',
    text: '',
    description: '',
    container:
      'உங்கள் {food} நீங்கள் பயன்படுத்திய கிண்ணத்தைப் போலவே இருக்கும் கிண்ணத்தைத் தேர்ந்தெடுக்கவும்.',
  },
  drinkScale: {
    name: 'பானம் அளவு',
    text: '',
    description: '',
    container: 'உங்கள் {food} நீங்கள் பயன்படுத்திய கோப்பை அல்லது கண்ணாடியைத் தேர்ந்தெடுக்கவும்.',
    serving: {
      header:
        'வலதுபுறத்தில் உள்ள ஸ்லைடரைப் பயன்படுத்தவும் அல்லது உங்கள் கோப்பை அல்லது கண்ணாடி எவ்வளவு நிரம்பியது என்பதைக் குறிக்க கோப்பை அல்லது கண்ணாடி மீது கிளிக் செய்யவும்.',
      hint: 'உங்கள் கோப்பை அல்லது கண்ணாடி எவ்வளவு நிரம்பியிருந்தது என்பதைக் குறிக்க இதை ஸ்லைடு செய்யவும்.',
      less: 'அவை குறைவாக நிரம்பியது',
      more: 'அவை மேலும் நிரம்பியிருந்தது',
      confirm: 'அவை அவ்வளவு நிரம்பியிருந்தது',
    },
    leftovers: {
      header: 'உங்கள் {food} சிலவற்றை விட்டுவிட்டீர்களா?',
      label:
        'வலதுபுறத்தில் உள்ள ஸ்லைடரைப் பயன்படுத்தி நீங்கள் எவ்வளவு மீதம் வைத்திருக்கிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்.',
      less: 'நான் குறைவாக விட்டுவிட்டேன்',
      more: 'நான் அதிகமாக விட்டுவிட்டேன்',
      confirm: 'அந்த அளவுக்கு விட்டுவிட்டேன்',
    },
  },
  guideImage: {
    name: 'வழிகாட்டி படம்',
    text: '',
    description: '',
    label: 'நீங்கள் வைத்திருந்த {food} அளவுக்கு மிக நெருக்கமான படத்தைத் தேர்ந்தெடுக்கவும்.',
    quantity: 'Choose how many of {food} you had.',
    confirm: 'என்னிடம் இவ்வளவு இருந்தது',
    expand: 'படத்தை விரிவாக்கு',
  },
  milkInAHotDrink: {
    name: 'சூடான பானத்தில் பால்',
    text: '',
    description: '',
    label: 'உங்களிடம் உள்ள அளவைத் தேர்ந்தெடுக்கவும்.',
    confirm: 'நான் அவ்வளவு எடுத்துக்கொண்டேன்',
  },
  milkOnCereal: {
    name: 'தானியத்தின் மீது பால்',
    text: '',
    description: '',
    container:
      'உங்கள் {food} நீங்கள் பயன்படுத்திய கிண்ணத்தைப் போலவே இருக்கும் கிண்ணத்தைத் தேர்ந்தெடுக்கவும்.',
    milk: 'உங்கள் பால் வந்த அளவைத் தேர்ந்தெடுங்கள் (தானியம் இல்லாமல்).',
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
  recipeBuilder: {
    back: 'Back to parent category',
    name: '{food} recipe builder',
    search: 'Search for Food',
    browse: 'Browse all relevant categories',
    root: 'all relevant Food categories',
    text: 'Build your own recipe',
    description: `Please follow the steps below to build your own recipe for {food}.`,
    source: 'Was it homemade?',
    homemade: 'Provide further details e.g. description of dish or ingredients.',
    purchased: 'Tell us where was it purchased from? Does it have a brand name?',
    barcode: 'Can you provide the barcode?',
    portionSize: 'How much did you eat? E.g. 1 pack, 2 teaspoons, 1 handful, 125 grams, ½ cup etc.',
    missing: {
      label: `I can't find my food`,
      description: `<p>If you can't find your food in the list, try rephrasing your description in the search text box above and click 'search again'.</p>
      <p>Or click 'Browse all foods' and explore the food categories.</p>
      <p>If you still can't find your food, click 'Report a missing food'.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
    addMore: 'Add more ingredients',
    noMore: 'No more ingredients',
  },
  parentFoodPortion: {
    name: 'Parent food portion',
    text: '',
    description: '',
    label: 'How much {food} did you have in your {parentFood}?',
    confirm: 'I had that much',
  },
  pizza: {
    name: 'பீட்சா',
    text: '',
    description: '',
    typeLabel: 'நீங்கள் வைத்திருந்த அளவுக்கு மிக நெருக்கமான பீட்சாவைத் தேர்ந்தெடுக்கவும்.',
    thicknessLabel: 'உங்கள் பீட்சா தடிமனாக இருந்ததா?',
    sizeLabel: 'உங்களிடம் என்ன அளவு துண்டுகள் இருந்தன?',
    whole: {
      label: 'நீங்கள்  எத்தனை பீட்சாக்கள் எடுத்துக்கொண்டீர்கள் ',
      confirm: 'நான் முழு பீட்சாவையும் எடுத்துக்கொண்டேன்',
    },
    slices: {
      label: 'இவற்றில் நீங்கள் எடுத்துக்கொண்டீர்கள்?',
    },
    confirm: 'நான் அவ்வளவு எடுத்து கொண்டேன்',
  },
  standardPortion: {
    name: 'நிலையான பகுதி',
    text: '',
    description: '',
    label: 'உங்கள் {food} பகுதியின் அளவை எவ்வாறு மதிப்பிட விரும்புகிறீர்கள்?',
    estimateIn: 'இல் {unit}',
    howMany: {
      _: '{unit} உங்களிடம் உள்ளதா?',
      placeholder: 'உங்களிடம் எத்தனை இருந்தன?',
      withFood: 'உங்களிடம் {food} {unit} உண்டா?',
    },
    confirm: 'நான் அவ்வளவு எடுத்து கொண்டேன்',
  },
  unknown: {
    name: 'தெரியாதவை ',
    text: '',
    description: 'தற்போது {food}க்கான பகுதி அளவை மதிப்பிடும் முறை இல்லை.',
  },
  weight: {
    name: 'எடை',
    text: '',
    description: 'உங்களிடம் எவ்வளவு இருந்தது என்பதை உள்ளிடவும்.',
  },
};

export default prompts;
