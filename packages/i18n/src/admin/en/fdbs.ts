import { LocaleMessageObject } from 'vue-i18n';

const fdbs: LocaleMessageObject = {
  _: 'Food database',
  id: 'FoodDB ID',
  title: 'Food databases',
  read: 'FoodDB detail',
  create: 'Add FoodDB',
  edit: 'Edit FoodDB',
  delete: 'Delete FoodDB',

  categories: {
    _: 'Category',
    title: 'Categories',
    add: 'Add category',
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
};

export default fdbs;
