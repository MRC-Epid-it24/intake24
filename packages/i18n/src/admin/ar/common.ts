import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  dashboard: 'لوحة القيادة',
  register: 'التسجيل',
  login: 'تسجيل الدخول',
  logout: {
    _: 'خروج',
    text: 'خروج',
  },

  admin: 'مشرف',
  local: 'الموقع',
  surveyMgmt: 'استطلاعات MGMT',
  acl: 'التمكن من',
  system: 'النظام',

  yes: 'نعم',
  true: 'نعم',
  no: 'لا',
  false: 'لا',
  none: 'لا شيء',

  name: 'اسم',
  displayName: 'ضع الكلمة المناسبة',
  description: 'وصف',

  createdAt: 'أنشئت في',
  updatedAt: 'تم التحديث في',

  sw: {
    check: 'تحديث المحتوى متاح',
    update: 'تحديث',
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
