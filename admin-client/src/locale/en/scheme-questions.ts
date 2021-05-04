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
    title: 'List of schemes containing question with ID: {id}',
    true: 'Question is synchronized',
    false: 'Question is not synchronized',
  },
};

export default schemeQuestions;
