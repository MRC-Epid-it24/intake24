import type { LocaleMessageObject } from 'vue-i18n';

const fdbs: LocaleMessageObject = {
  _: 'Food database',
  id: 'FoodDB ID',
  title: 'Food databases',
  read: 'FoodDB detail',
  create: 'Add FoodDB',
  edit: 'Edit FoodDB',
  delete: 'Delete FoodDB',

  showGlobalName: 'Show global name',

  categories: {
    _: 'Category',
    title: 'Categories',
    add: 'Add category',
    remove: 'Remove category',
    noCategory: 'Uncategorized',
    alreadyIncluded: `Category '{code}' is already included in current list.`,
    none: 'No category found for provided search.',
    global: {
      _: 'Global category settings',
      code: 'Code',
      name: 'English name',
      isHidden: 'Is hidden',
    },
    local: {
      _: 'Local category settings',
      name: 'Local name',
    },
    attributes: {
      _: 'Category attributes',
    },
    parentCategories: {
      _: 'Parent categories',
    },
  },

  foods: {
    _: 'Food',
    title: 'Foods',
    global: {
      _: 'Global food settings',
      code: 'Code',
      name: 'English name',
      foodGroup: 'Food group',
    },
    local: {
      _: 'Local food settings',
      name: 'Local name',
    },
    attributes: {
      _: 'Food attributes',
    },
    parentCategories: {
      _: 'Parent categories',
    },
  },

  attributes: {
    _: 'Attributes',
    title: 'Attributes',
    inherit: 'Inherit',
    override: 'Override',
    sameAsBeforeOption: 'Same as before option',
    readyMealOption: 'Was this a ready-made meal or food (e.g. ready to cook / eat / pre-packed)?',
    reasonableAmount: 'Reasonable amount (g/ml)',
    useInRecipes: {
      _: 'Use for recipes',
      '0': 'Use anywhere',
      '1': 'Use only as regular food',
      '2': 'Use only as recipe ingredient',
    },
  },

  nutrients: {
    _: 'Nutrient table record',
    title: 'Nutrient table records',
    add: 'Add nutrient record',
    remove: 'Remove nutrient record',
    alreadyIncluded: `Nutrient table record '{id}' is already included in current list.`,
    none: 'No nutrient table record found for provided search.',
  },

  portionSizes: {
    _: 'Portion size method',
    title: 'Portion size methods',
    add: 'Add portion size method',
    edit: 'Edit portion size method',
    remove: 'Remove portion size method',

    parameters: 'parameters',
    noParameters: 'Method does not have any further parameters.',
    description: 'Description',
    imageUrl: 'Image URL',
    useForRecipes: 'Use for recipes',
    conversionFactor: 'Conversion factor',

    methods: {
      _: 'Estimation method',
      'as-served': {
        _: 'As served',
        servingImageSet: 'Serving image set',
        leftoverImageSet: 'Leftover image set',
        removeLeftoverImageSet: 'Remove leftover image set',
      },
      'guide-image': {
        _: 'Guide image',
      },
      'drink-scale': {
        _: 'Drink scale',
        drinkwareSet: 'Drinkware set',
        initialLevel: 'Initial fill level',
        skipFillLevelPrompt: 'Skip fill level prompt',
      },
      'standard-portion': {
        _: 'Standard portion',
      },
      cereal: {
        _: 'Cereal',
      },
      'milk-on-cereal': {
        _: 'Milk on cereal',
      },
      pizza: {
        _: 'Pizza',
      },
      'milk-in-a-hot-drink': {
        _: 'Milk in a hot drink',
      },
      weight: {
        _: 'Weight',
      },
    },

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
};

export default fdbs;
