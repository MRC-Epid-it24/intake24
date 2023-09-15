import type { LocaleMessageObject } from 'vue-i18n';

import securables from './securables';

const locales: LocaleMessageObject = {
  _: 'Locale',
  code: 'Locale code',
  title: 'Locales',
  all: 'All locales',
  read: 'Locale detail',
  create: 'Add locale',
  edit: 'Edit locale',
  delete: 'Delete locale',

  prototypeLocaleId: 'Prototype locale',
  englishName: 'English name',
  localName: 'Local name',
  respondentLanguageId: 'Respondent UI language',
  adminLanguageId: 'Admin UI language',
  countryFlagCode: 'Country flag code',

  'split-lists': {
    _: 'Split list',
    title: 'Split lists',
    tab: 'Split lists',
    add: 'Add split list',
    remove: 'Remove split list',

    firstWord: 'First word',
    words: 'Word list (space-delimited)',
  },

  'split-words': {
    _: 'Split word',
    title: 'Split words',
    tab: 'Split words',
    add: 'Add split word',
    remove: 'Remove split word',

    words: 'Word list (space-delimited)',
  },

  'synonym-sets': {
    _: 'Synonym set',
    title: 'Synonym sets',
    tab: 'Synonym sets',
    add: 'Add synonym set',
    remove: 'Remove synonym set',

    synonyms: 'Synonyms (space-delimited)',
  },

  'recipe-foods': {
    _: 'Recipe food sets',
    title: 'Recipe foods set',
    tab: 'Recipe foods',
    add: 'Add recipe food',
    remove: 'Remove recipe food',
    special: 'Trigger word',
    code: 'Step code (assigned automatically)',
    synonyms_id: 'Synonyms (space-delimited)',
    steps: 'Recipe Builder Steps',
    name: 'Step Name',
    description: 'Step Description',
    ingredientsCategory: 'Step Ingredients Category',
    order: 'Step Order',
    repeat: 'Many ingredients',
  },

  'food-ranking': {
    _: 'Food ranking',
    title: 'Food ranking',
    tab: 'Food ranking',
    delete: 'Delete',
    upload: 'Upload food ranking CSV',
    description:
      'To enable the "predetermined order" food ranking algorithm in studies using this locale,\n' +
      '        upload a food ranking spreadsheet.',
  },

  tasks: {
    _: 'Locale task',
    title: 'Locale tasks',
    tab: 'tasks',
  },

  securables,
};

export default locales;
