export type ACLConfig = {
  roles: {
    superuser: string;
  };
  permissions: {
    globalsupport: string;
    surveyadmin: string;
    foodsadmin: string;
  };
};

const aclConfig: ACLConfig = {
  roles: {
    superuser: 'superuser',
  },
  permissions: {
    globalsupport: 'globalsupport',
    surveyadmin: 'surveyadmin',
    foodsadmin: 'foodsadmin',
  },
};

export default aclConfig;
