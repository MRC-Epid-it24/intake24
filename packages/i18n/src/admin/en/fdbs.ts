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
      code: 'Category code',
      name: 'English name',
      isHidden: 'Is hidden',
    },
    local: {
      _: 'Local category settings',
      id: 'Local category ID',
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
      code: 'Food code',
      name: 'English name',
      foodGroup: 'Food group',
    },
    local: {
      _: 'Local food settings',
      id: 'Local food ID',
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
  },
};

export default fdbs;
