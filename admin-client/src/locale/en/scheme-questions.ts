import { LocaleMessageObject } from 'vue-i18n';

const schemeQuestions: LocaleMessageObject = {
  _: 'Scheme question',
  id: 'Scheme ID',
  index: 'Scheme questions',
  detail: 'Scheme question detail',
  new: 'New scheme question',
  create: 'Add scheme question',
  edit: 'Edit scheme question',
  delete: 'Delete scheme question',

  editTemplate: 'Edit question template',
  sync: {
    _: 'Synchronization',
    tab: 'Synchronization',
    synchronize: 'Synchronize',
    confirm: 'Synchronize template with scheme',
    title: 'List of schemes containing question with ID: {id}',
    true: 'Question is synchronized',
    false: 'Question is not synchronized',
    noSchemes: 'No scheme contains this template yet.',
  },
};

export default schemeQuestions;
