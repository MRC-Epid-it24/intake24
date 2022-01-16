import { LocaleMessageObject } from 'vue-i18n';

const languages: LocaleMessageObject = {
  _: 'Languages',
  id: 'Language ID',
  title: 'Languages',
  all: 'All languages',
  read: 'Language detail',
  create: 'Add language',
  edit: 'Edit language',
  delete: 'Delete language',

  englishName: 'English name',
  localName: 'Local name',
  countryFlagCode: 'Country flag code',
  textDirections: {
    _: 'Text direction',
    ltr: 'Left to right',
    rtl: 'Right to left',
  },

  translations: {
    _: 'Translation',
    title: 'Translations',
    tab: 'Translations',
    edit: 'Edit section',
    path: 'Key path',
    applications: {
      admin: 'Admin',
      survey: 'Survey',
    },
    sections: {
      breadcrumbs: 'Breadcrumbs',
      feedback: 'Feedback',
      flags: 'Flags',
      login: 'Login',
      portion: 'Portion sizes',
      profile: 'Profile',
      prompts: 'Prompts',
      recall: 'Recall',
      standardUnits: 'Standard units',
      survey: 'Survey',
    },
  },
};

export default languages;
