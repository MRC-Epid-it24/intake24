import { LocaleMessageObject } from 'vue-i18n';

const permissions: LocaleMessageObject = {
  _: 'Permission',
  title: 'Permissions',
  all: 'All permissions',
  read: 'Permission detail',
  create: 'Add permission',
  edit: 'Edit permission',
  delete: 'Delete permission',

  groups: {
    global: 'Global',
    resources: 'Resources',
    surveys: 'Surveys',
    fdbs: 'Food databases',
  },

  survey: {
    admin: 'Survey admin',
    staff: 'Survey staff',
    support: 'Survey support',
  },
};

export default permissions;
