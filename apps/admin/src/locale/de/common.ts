import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  dashboard: 'Armaturenbrett',
  register: 'Registrierung',
  login: 'Einloggen',
  logout: {
    _: 'Ausloggen',
    text: 'Ausloggen',
  },

  admin: 'Administratorin',
  local: 'Lokalisierung',
  surveyMgmt: 'Umfragen MGMT',
  acl: 'Zugangskontrolle',
  system: 'System',

  yes: 'Ja',
  true: 'Ja',
  no: 'Nein',
  false: 'Nein',
  none: 'Keiner',

  name: 'Name',
  displayName: 'Etikette',
  description: 'Beschreibung',

  createdAt: 'Hergestellt in',
  updatedAt: 'Aktualisiert am',

  sw: {
    check: 'Inhaltsaktualisierung ist verfügbar',
    update: 'Aktualisieren',
  },

  action: {
    _: 'Action',
    active: 'Active',
    add: 'Add',
    audit: 'Audit',
    back: 'Back',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    create: 'Add',
    delete: 'Delete',
    destroy: 'Permanently delete',
    read: 'Detail',
    download: 'Download',
    edit: 'Edit',
    export: 'Export',
    load: 'Load',
    ok: 'Confirm',
    print: 'Print',
    questions: 'Questions',
    remove: 'Remove',
    restore: 'Restore',
    save: 'Save',
    transfer: 'Transfer',
    confirm: {
      _: 'Confirm',
      title: 'Do you want to continue?',
      delete: `Do you want to delete '{name}'?`,
      multi: {
        delete: 'Do you want to delete selected items: {count}',
      },
    },
  },

  msg: {
    stored: 'Record ({name}) has been stored.',
    updated: 'Record ({name}) has been updated.',
    deleted: 'Record ({name}) has been deleted.',
    multi: {
      deleted: 'Selected items were deleted ({count}).',
    },
    sent: 'Your message has been sent.',
  },

  search: {
    _: 'Search',
    filter: 'Filter',
    clear: 'Clear filter',
    count: 'Records count',
    selected: 'Records selected',
  },

  not: {
    provided: 'Not provided',
  },
};

export default common;
