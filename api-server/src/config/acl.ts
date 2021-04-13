export type ACLConfig = {
  cache: {
    enabled: boolean;
    expiresIn: number | string;
  };
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
  cache: {
    enabled: process.env.ACL_CACHE_ENABLED === 'true',
    expiresIn: process.env.ACL_CACHE_EXPIRES_IN ?? '7d',
  },
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
