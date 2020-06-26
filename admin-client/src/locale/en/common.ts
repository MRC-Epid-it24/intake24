import { LocaleMessage } from 'vue-i18n';

const common: LocaleMessage = {
  _: 'Intake24 Admin Tool',
  dashboard: 'Dashboard',
  register: 'Registration',
  login: 'Sign in',
  logout: 'Sign out',
  profile: 'Profile',

  acl: 'ACL',
  admin: 'Admin',
  surveyMgmt: 'Surveys MGMT',

  yes: 'Yes',
  true: 'Yes',
  no: 'No',
  false: 'No',

  action: {
    _: 'Action',
    audit: 'Audit',
    back: 'Back',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    create: 'Add',
    delete: 'Delete',
    destroy: 'Permanently delete',
    detail: 'Detail',
    download: 'Download',
    edit: 'Edit',
    export: 'Export',
    load: 'Load',
    print: 'Print',
    questions: 'Questions',
    restore: 'Restore',
    show: 'Info',
    save: 'Save',
    transfer: 'Transfer',
    multi: {
      delete: 'Delete selected items',
    },
    confirm: {
      delete: 'Do you really want to delete {name}?',
      multi: {
        delete: 'Selected items will be deleted: ',
      },
    },
  },

  search: {
    _: 'Search',
    filter: 'Filter',
    clear: 'Clear filter',
    count: 'Records count',
    selected: 'Records selected',
  },

  msg: {
    stored: 'Record ({name}) has been stored.',
    updated: 'Record ({name}) has been updated.',
    deleted: 'Record ({name}) has been deleted.',
    multi: {
      deleted: 'Selected items were deleted.',
    },
    sent: 'Your message has been sent.',
  },
};

export default common;
